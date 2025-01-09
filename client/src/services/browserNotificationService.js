class BrowserNotificationService {
  static async requestPermission() {
    try {
      if (!("Notification" in window)) {
        console.warn("This browser does not support desktop notifications");
        return false;
      }

      if (Notification.permission === "granted") {
        console.log("Notification permission already granted");
        return true;
      }

      if (Notification.permission !== "denied") {
        console.log("Requesting notification permission");
        const permission = await Notification.requestPermission();
        const granted = permission === "granted";
        console.log("Permission granted:", granted);

        if (granted) {
          this.showNotification("Notifications Enabled", {
            body: "You will now receive task notifications",
            icon: "/logo192.png",
            tag: "test-notification",
          });
        }

        return granted;
      }

      return false;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  }

  static async showNotification(title, options = {}) {
    try {
      console.log("Showing notification:", title, options);

      if (Notification.permission === "granted") {
        const notification = new Notification(title, {
          icon: "/logo192.png",
          badge: "/logo192.png",
          ...options,
          requireInteraction: true,
          silent: false,
        });

        notification.onclick = function (event) {
          event.preventDefault();
          window.focus();
          notification.close();
        };

        // Play notification sound
        try {
          const audio = new Audio("/notification.mp3");
          await audio.play();
        } catch (error) {
          console.log("Audio play failed:", error);
        }

        return notification;
      } else {
        console.warn("Notification permission not granted");
      }
    } catch (error) {
      console.error("Error showing notification:", error);
    }
  }

  static async scheduleNotification(title, options = {}, delay) {
    if (delay > 0) {
      setTimeout(() => {
        this.showNotification(title, options);
      }, delay);
    } else {
      this.showNotification(title, options);
    }
  }
}

export default BrowserNotificationService;
