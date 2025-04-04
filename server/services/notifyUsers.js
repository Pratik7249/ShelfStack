import cron from 'node-cron';
import { sendEmail } from '../utils/sendEmail.js';
import { User } from '../models/userModel.js';
import { Borrow } from '../models/borrowModel.js';

export const notifyUsers = () => {
  cron.schedule('*/10 * * * * *', async () => {
    try {
      const oneDayAgo = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
      const borrowers = await Borrow.find({ dueDate: { 
        $lt: oneDayAgo 
      },
      returnDate: null,
      notified: false
     });

     for(const element of borrowers) {
      if(element.user && element.user.email) {
        await User.findById(element.user.id);
        sendEmail({
          email:element.user.email,
          subject: "Book Due Date Reminder",
          message:`Hello ${user.name},  
                  This is a reminder that your book '${element.book.title}' is due soon. Please return or renew it before the due date.  
                  Thank you!`,
        })
        element.notified = true;
        await element.save();
        console.log('Email sent to:', element.user.email);
      }
     }
     
    } catch (error) {
      console.error('Error while notifying users:', error);
    }
  });
}