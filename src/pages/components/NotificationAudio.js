// ============================================================
// NOTIFICATION AUDIO — Pemutar Suara Notifikasi
// ============================================================
// Komponen tanpa tampilan visual (return null).
// Fungsi:
// 1. Saat mount → preload file audio /sounds/notification.mp3
// 2. Ekspos fungsi playSound ke global window.playNotificationSound
//    agar komponen lain bisa memanggil: window.playNotificationSound()
// 3. Cleanup saat unmount → pause & hapus referensi audio
// ============================================================
// components/NotificationAudio.js
"use client";

import { useEffect, useRef } from 'react';

// 🔥 URL audio notifikasi (bisa diganti dengan file audio sendiri)
const NOTIFICATION_SOUND_URL = '/sounds/notification.mp3';

export default function NotificationAudio({ 
  enabled = true, 
  volume = 0.5,
  onPlay = null 
}) {
  const audioRef = useRef(null);

  useEffect(() => {
    // Preload audio
    if (typeof window !== 'undefined') {
      const audio = new Audio(NOTIFICATION_SOUND_URL);
      audio.volume = volume;
      audio.preload = 'auto';
      audioRef.current = audio;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playSound = () => {
    try {
      if (audioRef.current && enabled) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(err => {
          console.log('Audio play error:', err);
        });
        if (onPlay) onPlay();
      }
    } catch (error) {
      console.error('Play notification sound error:', error);
    }
  };

  // 🔥 Ekspos fungsi playSound ke parent
  useEffect(() => {
    // Tambahkan ke window untuk akses global
    if (typeof window !== 'undefined') {
      window.playNotificationSound = playSound;
    }
  }, [playSound]);

  return null; // Komponen tidak render apapun
}