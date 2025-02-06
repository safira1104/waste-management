import { User } from 'lucide-react';
import {db} from './dbConfig';
import {Notifications, Users} from './schema';
import {eq, sql, and, desc} from 'drizzle-orm'
import { hasUncaughtExceptionCaptureCallback } from 'process';

export async function createUser(email:string, name:string) {
    try {
        const [user] = await db.insert(Users).values({email,name}).returning().execute();
        return user;
    } catch (error) {
        console.error('Error creating user', error)
        return null
    }
}

export async function getUserByEmail(email:string){
    try{
        const [user] = await db.select().from(Users).where(eq(Users.email, email)).execute();
        return user;
    }catch(error){
        console.error('Error fetching user by email', error)
        return null
    }
}

export async function getUnreadNotifications(userId:number) {
    try{
        return await db.select().from(Notifications).where(and(eq(Notifications.userId, userId), eq(Notifications.isRead, false))).execute();
    }catch(error){
        console.error('Error fetching unread notifications', error)
        return null
    }
}

export async function getUserBalance(userId:number):Promise<number> {
    const transactions = await getRewardTransactions(userId)
}

