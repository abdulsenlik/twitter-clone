import serverAuth from "@/libs/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if(req.method !== 'POST'){
        return res.status(405).end();
    }

   
    try {
        const { currentUser } = await serverAuth(req, res);
        console.log("Current user:", currentUser); // Debugging log
    
        const { body } = req.body;
        const { postId } = req.query;
        console.log("Received postId:", postId);
    
        if (!postId || typeof postId !== 'string') {
            throw new Error('Invalid ID');
        }
    
        const comment = await prisma.comment.create({
            data: {
                body,
                userId: currentUser?.id, // Ensure userId is valid
                postId
            }
        });
    
        console.log("Comment created:", comment);
    
        try {
            const post = await prisma.post.findUnique({
                where: { id: postId }
            });
    
            console.log("Post data:", post);
            if (post?.userId){
                console.log("Creating notification for user:", post.userId);
                await prisma.notification.create({
                    data: {
                        body: 'Someone replied to your post!',
                        userId: post.userId
                    }
                });
            
                console.log("Updating user notification flag for:", post.userId);
                await prisma.user.update({
                    where: { 
                        id: post.userId
                    },
                    data: {
                        hasNotification: true
                    }
                });
            }
    
        } catch (error) {
            console.log("Error in notification section:", error);
        }
    
        return res.status(200).json(comment);
    
    } catch (error) {
        console.log("Error in main handler:", error);
        return res.status(400).end();
    }
    
}
