import argon2 from 'argon2';

export async function hashPassword(password)
{
    return await argon2.hash(password);
}

export async function verifyPassword(hashpassword, password)
{
    return await argon2.verify(hashpassword,password);
}

