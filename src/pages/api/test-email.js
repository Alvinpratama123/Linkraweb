// pages/api/test-email.js
import { testSMTPConnection, sendNotificationToRole } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Test SMTP Connection
    if (req.method === 'GET') {
      const result = await testSMTPConnection();
      return res.status(200).json({
        message: 'SMTP Test',
        result
      });
    }

    // Test send email
    if (req.method === 'POST') {
      const { targetRole, email } = req.body;

      if (!targetRole && !email) {
        return res.status(400).json({ 
          error: 'targetRole atau email required' 
        });
      }

      // Buat report dummy
      const dummyReport = {
        id: 'test-' + Date.now(),
        projectName: 'Test Notifikasi Email',
        issueType: 'MODUL',
        description: 'Ini adalah test email notifikasi dari sistem Revision Issue Management.',
        progress: 'BELUM_DILAKUKAN',
        approval: 'PENDING',
        senderRole: 'QA',
        targetRole: targetRole || 'QA',
        sentBy: {
          name: 'System Test',
          role: 'QA',
          email: 'system@lintaswahana.com'
        }
      };

      let result;
      
      if (email) {
        // Kirim ke email spesifik
        const users = [{ email, name: 'Test User', role: targetRole || 'QA' }];
        result = await sendRevisionNotification(dummyReport, users);
      } else {
        // Kirim ke semua user dengan role tertentu
        result = await sendNotificationToRole(dummyReport, targetRole, prisma);
      }

      return res.status(200).json({
        success: true,
        message: 'Test email selesai',
        result
      });
    }

  } catch (error) {
    console.error('Test email error:', error);
    return res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}