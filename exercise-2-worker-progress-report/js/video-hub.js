/**
 * WCB PDF Generation Suite - Video Hub & Interactive Media Module
 * Features:
 * 1. Interactive Video Demonstration Player with Chapter Navigation & Visual Canvas Player
 * 2. In-Browser Webcam Video Check-in Recorder (MediaRecorder API for Rehab Video Updates)
 * 3. Synchronized 2-Minute Video Presentation Script Viewer (PiP Guide)
 */

const VideoHub = (function () {
  'use strict';

  // Video State
  const state = {
    activeTab: 'player', // 'player' | 'recorder' | 'script'
    activeChapter: 0,
    isPlaying: false,
    mediaRecorder: null,
    recordedChunks: [],
    recordedBlob: null,
    recordedUrl: null,
    isRecording: false,
    recordTimerInterval: null,
    recordSeconds: 0,
    stream: null
  };

  // Video Chapters & Narration Timestamps
  const videoChapters = [
    {
      title: "1. Overview & PDF Replication (0:00 - 0:25)",
      time: "0:00",
      description: "Analysis of the WCB Manitoba official forms: vector logo, contact address, claim boxes, dynamic tables, and statutory declarations.",
      action: "showOverview"
    },
    {
      title: "2. Medical & Travel Expenses (0:25 - 0:50)",
      time: "0:25",
      description: "6 expense tables (Rx, OTC, Medical Supplies, Parking, Mileage with excess travel calculation, Bus/Taxi with pre-approval flags).",
      action: "showExpense"
    },
    {
      title: "3. Worker Progress Report (0:50 - 1:15)",
      time: "0:50",
      description: "Duty classification, return-to-work narrative, interactive 1-10 pain scale, treatment schedules, and certification.",
      action: "showProgress"
    },
    {
      title: "4. Dynamic Multi-Page Stress Test (1:15 - 1:40)",
      time: "1:15",
      description: "Smart dynamic pagination engine calculating content budgets and spawning 3+ pages with dynamic Page X of Y footers.",
      action: "showPagination"
    },
    {
      title: "5. Native Printing & AI Assistant (1:40 - 2:00)",
      time: "1:40",
      description: "Direct 1-click Letter PDF export and AI-powered receipt parsing, clinical summaries, and policy audit.",
      action: "showPrint"
    }
  ];

  /**
   * Start Canvas-based Interactive Video Demo
   */
  function initCanvasPlayer(canvasElement) {
    if (!canvasElement) return;
    const ctx = canvasElement.getContext('2d');
    let frame = 0;

    function renderDemoFrame() {
      if (!canvasElement) return;
      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

      // Background Gradient
      const grad = ctx.createLinearGradient(0, 0, canvasElement.width, canvasElement.height);
      grad.addColorStop(0, '#073c4d');
      grad.addColorStop(1, '#1a252f');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);

      // Header Banner
      ctx.fillStyle = '#0b5871';
      ctx.fillRect(30, 24, canvasElement.width - 60, 48);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('Workers Compensation Board of Manitoba - Interactive Portal', 50, 54);

      // Chapter text
      const currentCh = videoChapters[state.activeChapter] || videoChapters[0];
      ctx.fillStyle = '#c88a1e';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(`Active Chapter: ${currentCh.title}`, 50, 110);

      // Description text
      ctx.fillStyle = '#e6f1f4';
      ctx.font = '13px sans-serif';
      ctx.fillText(currentCh.description, 50, 140);

      // Draw Simulated PDF Document Box
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 12;
      ctx.fillRect(50, 170, canvasElement.width - 100, 160);
      ctx.shadowBlur = 0;

      // Simulated Document Lines
      ctx.fillStyle = '#0b5871';
      ctx.fillRect(70, 190, 80, 20); // Logo
      ctx.fillStyle = '#333333';
      ctx.font = 'bold 12px serif';
      ctx.fillText('Medical & Travel Expense Request / Worker Progress Report', 165, 205);

      // Table skeleton animation
      const animOffset = Math.sin(frame * 0.05) * 5;
      ctx.strokeStyle = '#dee2e6';
      ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) {
        ctx.strokeRect(70, 225 + i * 22, canvasElement.width - 140, 20);
        ctx.fillStyle = i === 0 ? '#f0f3f5' : '#ffffff';
        ctx.fillRect(71, 226 + i * 22, canvasElement.width - 142, 18);
      }

      // Animated cursor/indicator
      ctx.fillStyle = '#3498db';
      ctx.beginPath();
      ctx.arc(300 + animOffset * 6, 250, 6, 0, Math.PI * 2);
      ctx.fill();

      // Timestamp
      ctx.fillStyle = '#bdc3c7';
      ctx.font = '11px monospace';
      ctx.fillText(`Timestamp: ${currentCh.time} | Live Dynamic Engine`, 50, 350);

      frame++;
      if (state.isPlaying) {
        requestAnimationFrame(renderDemoFrame);
      }
    }

    renderDemoFrame();
  }

  /**
   * Webcam Video Check-in Recorder Initialization
   */
  async function startWebcamPreview(videoElement) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Camera access is not supported by your browser.');
      return false;
    }

    try {
      state.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoElement) {
        videoElement.srcObject = state.stream;
        videoElement.play();
      }
      return true;
    } catch (err) {
      console.warn('Webcam access error or permission denied:', err);
      // Create a fallback simulated camera canvas stream if physical webcam is blocked
      return false;
    }
  }

  /**
   * Start Recording Check-in Video
   */
  function startRecording(onTimerTick) {
    if (!state.stream) return false;

    state.recordedChunks = [];
    state.recordSeconds = 0;

    try {
      state.mediaRecorder = new MediaRecorder(state.stream);
      state.mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          state.recordedChunks.push(e.data);
        }
      };

      state.mediaRecorder.onstop = () => {
        state.recordedBlob = new Blob(state.recordedChunks, { type: 'video/webm' });
        state.recordedUrl = URL.createObjectURL(state.recordedBlob);
      };

      state.mediaRecorder.start(100);
      state.isRecording = true;

      // Timer
      state.recordTimerInterval = setInterval(() => {
        state.recordSeconds++;
        if (typeof onTimerTick === 'function') {
          const mins = String(Math.floor(state.recordSeconds / 60)).padStart(2, '0');
          const secs = String(state.recordSeconds % 60).padStart(2, '0');
          onTimerTick(`${mins}:${secs}`);
        }
        if (state.recordSeconds >= 120) { // 2-min limit
          stopRecording();
        }
      }, 1000);

      return true;
    } catch (err) {
      console.error('MediaRecorder start error:', err);
      return false;
    }
  }

  /**
   * Stop Recording Check-in Video
   */
  function stopRecording() {
    if (state.mediaRecorder && state.isRecording) {
      state.mediaRecorder.stop();
      state.isRecording = false;
      clearInterval(state.recordTimerInterval);
      return true;
    }
    return false;
  }

  /**
   * Stop Webcam Stream & Clean up
   */
  function stopWebcamStream() {
    if (state.stream) {
      state.stream.getTracks().forEach(track => track.stop());
      state.stream = null;
    }
    clearInterval(state.recordTimerInterval);
    state.isRecording = false;
  }

  // Public Interface
  return {
    state,
    videoChapters,
    initCanvasPlayer,
    startWebcamPreview,
    startRecording,
    stopRecording,
    stopWebcamStream
  };
})();

// Export globally
window.VideoHub = VideoHub;
