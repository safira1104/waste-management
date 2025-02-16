import { User } from 'lucide-react';
import {db} from './dbConfig';
import {Notifications, Users, Transactions, Reports, Rewards} from './schema';
import {eq, sql, and, desc} from 'drizzle-orm';
import { date } from 'drizzle-orm/mysql-core';
import { use } from 'react';
import { execSync } from 'child_process';


export async function createUser(email:string, name:string) {
    try {
        const [user] = await db.insert(Users).values({email,name}).returning().execute();
        return user;
    } catch (error) {
        console.error('Error creating user', error)
        return null;
    }
}

export async function getUserByEmail(email:string){
    try{
        const [user] = await db.select().from(Users).where(eq(Users.email, email)).execute();
        return user;
    }catch(error){
        console.error('Error fetching user by email', error)
        return null;
    }
}

export async function getUnreadNotifications(userId:number) {
    try{
        return await db.select().from(Notifications).where(and(eq(Notifications.userId, userId), eq(Notifications.isRead, false))).execute();
    }catch(error){
        console.error('Error fetching unread notifications', error)
        return null;
    }
}

export async function getUserBalance(userId:number):Promise<number> {
    const transactions = await getRewardTransactions(userId) || [];

    if(!transactions) return 0;

    const balance = transactions.reduce((acc:number, transaction:any)=> {
        return transaction.type.startsWith('earned') ? acc + transaction.amount : acc - transaction.amount
    },0)
    return Math.max(balance,0)
}

export async function getRewardTransactions(userId:number) {
    try{
        const transactions = await db.select({
            id: Transactions.id,
            type: Transactions.type,
            amount: Transactions.amount,
            description: Transactions.description,
            date: Transactions.date
        }).from(Transactions).where(eq(Transactions.userId, userId)).orderBy(desc(Transactions.date)).limit(10).execute();
        
        const formattedTransactions = transactions.map(t=> ({
            ...t,
            date: t.date instanceof Date ? t.date.toISOString().split('T')[0] : t.date
        }))

        return formattedTransactions;
    }catch(error){
        console.error('Error fetching reward transactions', error);
        return null;
    }
}

export async function markNotificationAsRead(notificationId:number) {
    try{
        await db.update(Notifications).set({isRead: true}).where(eq(Notifications.id, notificationId)).execute();
    }catch(error){
        console.error('Error marking notification as read', error);
        return null;
    }

}

export async function createReport(
    userId: number,
    location: string,
    wasteType: string,
    amount : string,
    imageUrl?: string,
    verificationResult?:any,
    ) {
    
    try{
        const [report] = await db.insert(Reports).values({
            userId,location,wasteType,imageUrl, verificationResult, status:'pending',
        }).returning().execute();

        const pointsEarned = 10;
        // updateRewardPoints
        await updateRewardPoints(userId, pointsEarned);
        // createTransaction
        await createTransaction(userId,'earned_report', pointsEarned,'Points earned for reporting waste');
        //createNotification
        await createNotification(userId, `You've earned ${pointsEarned} points for reporting waste!`, 'reward');
        return report
    }catch(e){
        console.error('Error creating report', e);
        return null;
    }
}


export async function updateRewardPoints(userId:number, pointsToAdd:number) {
    try{
        const [updatedReward] = await db.update(Rewards).set({
            points: sql`${Rewards.points} + ${pointsToAdd}`
        }).where(eq(Rewards.userId, userId)).returning().execute();
        return updatedReward;
    }catch(e){
        console.error('Error updating reward points', e);
        return null;
    }
}

export async function createTransaction(userId:number, type: 'earned_report' | 'earned_collect' | 'redeemed', amount:number, description:string) {
    try{
        const [transaction] = await db.insert(Transactions).values({
            userId,type, amount, description
        }).returning().execute();
        return transaction;
    }catch(e){
        console.error('Error creating transactions', e)
        throw e;
    } 
}

export async function createNotification(userId:number, message:string,type:string ) {
 try{
    const [notification] = await db.insert(Notifications).values({userId,message,type}).returning().execute();
    return notification;
 }catch(e){
    console.error('Error creating notification', e)
 }
}