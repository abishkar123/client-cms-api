import express from 'express'
import { v4 as uuidv4 } from 'uuid';
import {  comparePassword, hashPassword } from '../utils/bcrypt.js';
import { createNewUser, findUser, updateProfile1, updateUser } from '../model/user/UserModel.js';
import { loginValidation, passResetValidation } from '../middleware/joiMiddleware.js';
import { emailOtp, emailVerifiedNotification, newAccountEmailVerificationEmail, passwordUpdateNotification } from '../utils/nodemailer.js';
import { singAccessJWT, singRefreshJWT, verifyRefreshJWT } from '../utils/jwt.js';
import { isAuth } from '../middleware/authMIddleware.js';
import { numString } from '../utils/randomGenerator.js';
import { createNewSession, deleteSession } from '../model/session/SessionModel.js';

const router= express.Router();

//Register page
router.post("/register", async (req, res, next) => {
    try {
        req.body.password = hashPassword(req.body.password);

        req.body.emailVerificationCode = uuidv4();
        const result = await createNewUser(req.body)
        if (result?._id) {
            const uniqueLink = `${process.env.FRONTEND_ROOT_URL}/verify?c=${result.emailVerificationCode}&email=${result.email}`;
            const link = await newAccountEmailVerificationEmail(uniqueLink, result);
            console.log(link)
            res.json({
                status: "success",
                message:
                    "We have send a  email verification in shortly",
                link
            });

            return
        }
        res.json({
            status: "error",
            message: "Error, Unable to create a new User",
        });

    } catch (error) {
        if (error.message.includes("E11000 duplicate key error collection")) {
            error.message =
                "There is already account exist associated with this email";
            error.errorCode = 200;
        }
        next(error);


    }
}
)

//  user email verification
router.post("/verify", async (req, res, next) => {
    try {
        // chek if the combination of email and code exist in db if so set the status active and code to "" in the db, also update is email verified to true

        const obj = {
            status: "active",
            isEmailVerified: true,
            emailVerificationCode: "",
        };

        const user = await updateUser(req.body, obj);

        if (user?._id) {
            //send email notification
            emailVerifiedNotification(user);
            res.json({
                status: "success",
                message: "Your account has been verified. You may login now",
            });

            return;
        }

        res.json({
            status: "error",
            message: "The link is invalid or expired.",
        });
    } catch (error) {
        next(error);
    }
});


//user login
router.post("/login", loginValidation, async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const newcustomer = {
            email: email,
            password: password
        }
        const user = await findUser({ email })
        if (user?._id) {
            if (!user?.isEmailVerified) {
                return res.json({
                    status: "error",
                    message:
                        "You email is not veirfied. Check your email and follow the instruction and verify your account.",
                    user,
                })
            }
            const isPassMatch = comparePassword(password, user.password);
            if (isPassMatch) {
                user.password = undefined;
                user.__v = undefined;
                res.json({
                    status: "success",
                    message: "Login success fully",
                    toknes: {
                        accessJWT: await singAccessJWT({ email }),
                        refreshJWT: await singRefreshJWT({ email }),
                    },
                    user
                })
                return

            } else {
                res.json({
                    status: "error",
                    message: "Incorrect password",

                })

            }

        } else {
            res.json({
                status: "error",
                message: "please register to become new customer",
                newcustomer
            });
        }


    } catch (error) {
        next(error)
    }

})


// otp request
router.post("/request-otp", async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.json({
                status: "error",
                message: "Invalid request",
            });
        }

        const user = await findUser({ email });

        if (user?._id) {
            //create otp,
            const token = numString(6)
            const obj = {
                token,
                associate: email,
            };
            //store opt and emial in new tabale called sessions
            const result = await createNewSession(obj);

            if (result?._id) {
                //send that otp to their email
                const link = await emailOtp({ email, token });
               

                return res.json({
                    status: "success",
                    message:
                        "We have sent you an OTP to your email, chek your email and fill up the form below.",
                    link
                });
            }
        }

        res.json({
            status: "error",
            message: "Wrong email",
        });
    } catch (error) {
        next(error);
    }
});

// password reset request
router.patch("/reset-password", passResetValidation, async (req, res, next) => {
    try {
        const { email, opt, password } = req.body;

        const deletedToke = await deleteSession({ email, opt });

        if (deletedToke?._id) {
            //encrypt password and/update user password
            const user = await updateUser(
                { email },
                { password: hashPassword(password) }
            );

            if (user?._id) {
                //send email notification
                const link = await passwordUpdateNotification(user);
                console.log(link)
                return res.json({
                    status: "success",
                    message: "You password has been updated successfully",
                    link
                });
            }
        }

        res.json({
            status: "error",
            message: "Unable to update your password. Invalid or expired token",
        });
    } catch (error) {
        next(error);
    }
});



// reutrn user info
router.get("/user-profile", isAuth, (req, res, next) => {
    try {
        const user = req.userInfo;
        user.password = undefined;
      

        res.json({
            status: "success",
            message: "user found",
            user,
        });
    } catch (error) {
        next(error);
    }
});

router.put("/user-profile", async (req, res, next) => {
    try {
        const result = await updateProfile1(req.body);
      
        if (result?._id) {
            return res.json({
                status: "success",
                message: "The user has been updated!",
                result,
            })
        }
        res.json({
            status: "error",
            message: "Unanble to upda the profile, please try gain later",
        });

    } catch (error) {
        next(error)

    }

})


// reutrn new accessJWT
router.get("/new-accessjwt", async (req, res, next) => {
    try {
        const { authorization } = req.headers;

        const { email } = verifyRefreshJWT(authorization);

        if (email) {
            const user = await findUser({ email });

            if (user?.refreshJWT === authorization) {
                // create accessJWT and return
                const accessJWT = await singAccessJWT({ email });

                if (accessJWT) {
                    return res.json({
                        status: "success",
                        accessJWT,
                    });
                }
            }
        }

        res.status(401).json({
            status: "error",
            message: "unauthenticated",
        });
    } catch (error) {
        next(error);
    }
});

export default router;

