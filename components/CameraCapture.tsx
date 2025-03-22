'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function CameraCapture({ 
  onCapture 
}: { 
  onCapture: (imageData: string) => void 
}) {
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
    } catch (error) {
      console.error('Camera access failed:', error);
    }
  };

  const takePhoto = () => {
    if (!stream) return;
    const video = document.createElement('video');
    video.srcObject = stream;
    video.play();

    video.onplaying = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      onCapture(imageData);
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    };
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {stream ? (
        <>
          <video
            autoPlay
            playsInline
            ref={(video) => {
              if (video) video.srcObject = stream;
            }}
            className="max-w-[300px] rounded-lg"
          />
          <Button onClick={takePhoto} className="w-full max-w-[300px]">
            Take Photo
          </Button>
        </>
      ) : (
        <Button onClick={startCamera} className="w-full max-w-[300px]">
          Start Camera
        </Button>
      )}
    </div>
  );
}
