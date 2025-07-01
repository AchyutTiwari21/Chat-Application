import { z } from "zod";

const signupSchema = z.object({
    username: z.string().min(3).max(50),
    name: z.string().min(1).max(50).nullish(),
    age: z.string().min(1).max(3).nullish(),
    profilePicture: z.string().min(1).max(100).nullish(),
    email: z.string().min(5).max(50).email(),
    password: z.string().min(5).max(50)
}).superRefine(({password}, checkPassComplexity) => {
    const containsUpperCase = (ch: string): Boolean => /[A-Z]/.test(ch);
    const containsLowerCase = (ch: string): Boolean => /[a-z]/.test(ch);
    const containsSpecialChar = (ch: string): Boolean => /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);

    let countOfUpperCase = 0, countOfLowerCase = 0, countOfSpecialChar = 0, countOfNumber = 0;

    for(let i = 0; i < password.length; i++) {
        let ch = password.charAt(i);
        if(!isNaN(+ch)) countOfNumber++;
        if(containsLowerCase(ch)) countOfLowerCase++;
        if(containsUpperCase(ch)) countOfUpperCase++;
        if(containsSpecialChar(ch)) countOfSpecialChar++;
    }

    let errObj = {
        upperCase: {pass: true, message:"Add upper case."},
        lowerCase: {pass: true, message:"Add lower case."},
        specialChar: {pass: true, message: "Add special character."},
        totalNumber: {pass: true, message: "Add number."}
    };

    if(countOfLowerCase < 1) {
        errObj = {...errObj, lowerCase: {...errObj.lowerCase, pass: false}};
    }
    if(countOfUpperCase < 1) {
        errObj = {...errObj, upperCase: {...errObj.upperCase, pass: false}};
    }
    if(countOfSpecialChar < 1) {
        errObj = {...errObj, specialChar: {...errObj.specialChar, pass: false}};
    }
    if(countOfNumber < 1) {
        errObj = {...errObj, totalNumber: {...errObj.totalNumber, pass: false}};
    }

    if(countOfLowerCase < 1 || countOfUpperCase < 1 || countOfSpecialChar < 1 || countOfNumber < 1) {
        checkPassComplexity.addIssue({
            code: "custom",
            path: ["password"],
            message: errObj.toString()
        });
    }
});

const signinSchema = z.object({
    username: z.string().min(3).max(50),
    email: z.string().min(5).max(50).email(),
    password: z.string().min(5).max(50)
});

const createRoomSchema = z.object({
    slug: z.string().min(3).max(50)
});

export {
    signupSchema,
    signinSchema,
    createRoomSchema
}