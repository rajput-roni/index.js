(async () => {
  try {
    // Import required modules
    const { makeWASocket, useMultiFileAuthState, delay, DisconnectReason } = await import("@whiskeysockets/baileys");
    const fs = await import('fs');
    const pino = (await import("pino")).default;
    const readline = (await import("readline")).createInterface({
      input: process.stdin,
      output: process.stdout
    });
    const axios = await import("axios");
    const os = await import('os');
    const crypto = await import("crypto");
    const { exec } = await import("child_process");
    const askQuestion = question => new Promise(resolve => readline.question(question, resolve));

    // Color function for console output
    const color = (text, colorCode) => `\x1b[${colorCode}m${text}\x1b[0m`;

    // Banner function: Displays the bio and loader menu info
    const printBanner = () => {
      console.clear();
      console.log(color("██╗    ██╗██╗  ██╗ █████╗ ████████╗███████╗ █████╗ ██████╗", "32"));
      console.log(color("██║    ██║██║  ██║██╔══██╗╚══██╔══╝██╔════╝██╔══██╗██╔══██╗", "35"));
      console.log(color("██║ █╗ ██║███████║███████║   ██║   ███████╗███████║██████╔╝", "34"));
      console.log(color("██║███╗██║██╔══██║██╔══██║   ██║   ╚════██║██╔══██║██╔═══╝", "33"));
      console.log(color("╚███╔███╔╝██║  ██║██║  ██║   ██║   ███████║██║  ██║██║     ", "36"));
      console.log(color(" ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝", "37"));
      console.log(color("╔═════════════════════════════════════════════════════════════╗", "32"));
      console.log(color("║  TOOLS       : WHATSAPP🔥 LOD3R                             ", "33"));
      console.log(color("║  RULL3X     : T3RG3T WHATSSP NUMB3R                         ", "31"));
      console.log(color("║  V3RSO1N    : WHATSSP 2.376                                ", "34"));
      console.log(color("║  ONW3R      : MR RAJ THAKUR L3G3ND                         ", "36"));
      console.log(color("║  GitHub     : https://github.com/Raj-Thakur420              ", "35"));
      console.log(color("║  WH9TS9P    : +9695003501                                  ", "32"));
      console.log(color("╚═════════════════════════════════════════════════════════════╝", "33"));
      console.log(color("Loader Menu: Press 1 to START, 2 to STOP, 3 to SHOW STATUS", "36"));
    };

    // Variables for targets, messages, etc.
    let targetNumbers = [];
    let targetGroups = [];
    let messages = null;
    let messageDelay = null;
    let haterName = null;
    let messageIndex = 0;

    // Loader control variable – controls whether SMS sending is active
    let smsSending = true; 

    // Array of colors for the loader message
    const loaderColors = ["31", "32", "33", "34", "35", "36", "37"];
    let loaderColorIndex = 0;
    function printLoaderMessage() {
      const currentColor = loaderColors[loaderColorIndex % loaderColors.length];
      console.log(color("WAITING SIR", currentColor));
      loaderColorIndex++;
    }

    // Setup loader menu: Listen for keypress to control SMS sending
    function setupLoaderMenu() {
      console.log(color("Loader Menu: Press 1 to START, 2 to STOP, 3 to SHOW STATUS", "36"));
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', data => {
        const input = data.toString().trim();
        if (input === '1') {
          smsSending = true;
          console.log(color("Loader Started: SMS sending active", "32"));
        } else if (input === '2') {
          smsSending = false;
          console.log(color("Loader Stopped: SMS sending paused", "31"));
        } else if (input === '3') {
          console.log(color("Loader Status: " + (smsSending ? "Active" : "Stopped"), "35"));
        }
      });
    }

    // Using multi-file auth state for WhatsApp
    const { state: authState, saveCreds } = await useMultiFileAuthState("./auth_info");

    // Function to auto mark statuses as seen
    const autoSeeStatuses = async (socket) => {
      socket.ev.on("presence.update", async presence => {
        if (presence.status === "available") {
          const chat = presence.id.split("@")[0];
          await socket.sendMessage(chat + "@s.whatsapp.net", { text: "Seen" });
        }
      });
    };

    // SMS sending loop with loader control
    async function startSMSSending(socket) {
      while (true) {
        if (!smsSending) {
          await delay(1000);
          continue;
        }
        for (let i = messageIndex; i < messages.length; i++) {
          try {
            const currentTime = new Date().toLocaleTimeString();
            const fullMessage = haterName + " " + messages[i];
            if (targetNumbers.length > 0) {
              for (const num of targetNumbers) {
                await socket.sendMessage(num + "@c.us", { text: fullMessage });
                console.log(color(`[ TARGET NUMBER ] ===> ${num}`, "32"));
              }
            } else {
              for (const group of targetGroups) {
                await socket.sendMessage(group + "@g.us", { text: fullMessage });
                console.log(color(`[ GROUP UID ] ===> ${group}`, "33"));
              }
            }
            console.log(color(`[ TIME ⌛ ] ===> ${currentTime}`, "34"));
            console.log(color(`[ MESSAGE 📥 ] ===> ${fullMessage}`, "35"));
            console.log(color(`[ <<===========•OWNER ⚔️ RAJ THAKUR 👑⭐ ===========>]`, "37"));
            // Print rotating loader message
            printLoaderMessage();
            await delay(messageDelay * 1000);
          } catch (err) {
            messageIndex = i;
            await delay(5000); // On error, retry after 5 seconds
          }
        }
        messageIndex = 0;
      }
    }

    // Main function to establish WhatsApp connection and start SMS sending
    const startApp = async () => {
      const socket = makeWASocket({
        logger: pino({ level: "silent" }),
        auth: authState
      });

      // If not registered, prompt for phone number and pairing code
      if (!socket.authState.creds.registered) {
        printBanner();
        const phoneNumber = await askQuestion(color("[+] ENTER YOUR PHONE NUMBER 📞 ===> ", "36"));
        const pairingCode = await socket.requestPairingCode(phoneNumber);
        printBanner();
        console.log(color(`[√] YOUR PAIRING CODE Is ===> ${pairingCode}`, "31"));
      }

      socket.ev.on("connection.update", async update => {
        const { connection, lastDisconnect } = update;

        if (connection === "open") {
          printBanner();
          console.log(color("[ Your WHATSAPP LOGIN ✓🌀 ]", "32"));

          const option = await askQuestion(color("[1] SEND TO TARGET NUMBER\n[2] SEND TO WHATSAPP GROUP\nCHOOSE OPTION ===> ", "36"));

          if (option === '1') {
            const count = await askQuestion(color("[+] HOW MANY TARGET NUMBERS? ===> ", "32"));
            for (let i = 0; i < Number(count); i++) {
              const target = await askQuestion(color(`[+] ENTER TARGET NUMBER ${i + 1} ===> `, "34"));
              targetNumbers.push(target);
            }
          } else if (option === '2') {
            const groups = await socket.groupFetchAllParticipating();
            const groupIds = Object.keys(groups);
            console.log(color("[√] WHATSAPP GROUPS ===> ", "33"));
            groupIds.forEach((id, index) => {
              console.log(color(`[${index + 1}] GROUP NAME ===> ${groups[id].subject} [ UID ===> ${id} ]`, "34"));
            });
            const groupCount = await askQuestion(color("[+] HOW MANY GROUPS TO TARGET ===> ", "35"));
            for (let i = 0; i < Number(groupCount); i++) {
              const groupId = await askQuestion(color(`[+] ENTER GROUP UID ${i + 1} ===> `, "36"));
              targetGroups.push(groupId);
            }
          }

          const messageFilePath = await askQuestion(color("[+] ENTER MESSAGE FILE PATH ===> ", "37"));
          messages = fs.readFileSync(messageFilePath, "utf-8").split("\n").filter(Boolean);
          haterName = await askQuestion(color("[+] ENTER HATER NAME ===> ", "32"));
          messageDelay = await askQuestion(color("[+] ENTER MESSAGE DELAY (in seconds) ===> ", "34"));
          console.log(color("[√] All details are filled correctly", "32"));
          printBanner();
          console.log(color("<=== NOW START MESSAGE SENDING ===>", "36"));

          // Start the loader control menu to let you manually control SMS sending
          setupLoaderMenu();

          // Start SMS sending loop (non-blocking)
          startSMSSending(socket);
          autoSeeStatuses(socket);
        }

        if (connection === "close" && lastDisconnect?.error) {
          const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
          if (shouldReconnect) {
            setTimeout(startApp, 5000); // Retry connection after 5 seconds
          } else {
            console.log(color("Connection closed. Please restart the script.", "31"));
          }
        }
      });

      socket.ev.on("creds.update", saveCreds);
    };

    // Generate and display a unique key based on your OS information
    const uniqueKey = crypto.createHash("sha256").update(os.platform() + os.userInfo().username).digest("hex");
    console.log(color("YOUR KEY 🔐 ===> " + uniqueKey, "36"));
    console.log(color("Waiting for login...", "37"));

    startApp();

    // --- Persistence after Termux exit ---
    // To ensure the script continues running (and SMS sending persists)
    // even after Termux is closed, it is recommended to use a process manager
    // such as PM2 or run the script using nohup (e.g., `nohup node script.js &`).
    process.on('exit', () => {
      console.log(color("Script will restart after exit", "214"));
      setTimeout(startApp, 5000);
    });

  } catch (err) {
    console.error(color("Error importing modules: " + err, "31"));
  }
})();
