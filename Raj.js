// Self-daemonize logic: Agar process abhi daemonized nahin hai, toh khud ko detached mode mein spawn karo.
if (!process.env.DAEMONIZED) {
  const { spawn } = await import("child_process");
  const child = spawn(process.argv[0], process.argv.slice(1), {
    detached: true,
    stdio: "ignore",
    env: { ...process.env, DAEMONIZED: "true" }
  });
  child.unref();
  process.exit();
}

(async () => {
  try {
    const { makeWASocket: _0x4f98c4, useMultiFileAuthState: _0x43d940, delay: _0x2bedd9, DisconnectReason: _0x13d9dd } = await import("@whiskeysockets/baileys");
    const _0x5f1924 = await import('fs');
    const _0x3381b6 = (await import("pino")).default;
    const _0x41d8de = (await import("readline")).createInterface({
      input: process.stdin,
      output: process.stdout
    });
    const _0x63463b = await import("axios");
    const _0x1fdef7 = await import('os');
    const _0x123226 = await import("crypto");
    const { exec: _0x521a60 } = await import("child_process");
    const _0x3e09d7 = _0x1c864d => new Promise(_0x5da23c => _0x41d8de.question(_0x1c864d, _0x5da23c));

    // Color function for easy use
    const color = (text, colorCode) => `\x1b[${colorCode}m${text}\x1b[0m`;

    const _0x1e9ef5 = () => {
      console.clear();
      console.log(color("██╗    ██╗██╗  ██╗ █████╗ ████████╗███████╗ █████╗ ██████╗", "32"));
      console.log(color("██║    ██║██║  ██║██╔══██╗╚══██╔══╝██╔════╝██╔══██╗██╔══██╗", "35"));
      console.log(color("██║ █╗ ██║███████║███████║   ██║   ███████╗███████║██████╔╝", "34"));
      console.log(color("██║███╗██║██╔══██║██╔══██║   ██║   ╚════██║██╔══██║██╔═══╝", "33"));
      console.log(color("╚███╔███╔╝██║  ██║██║  ██║   ██║   ███████║██║  ██║██║     ", "36"));
      console.log(color(" ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝", "37"));
      console.log(color("╔═════════════════════════════════════════════════════════════╗", "32"));
      console.log(color("║  TOOLS       : WHATSAPP🔥 LOD3R                  ", "33"));
      console.log(color("║  RULL3X     : T3RG3T WHATSSP NUMB3R", "31"));
      console.log(color("║  V3RSO1N  : WHATSSP 2.376", "34"));
      console.log(color("║  ONW3R      : MR RAJ THAKUR L3G3ND", "36"));
      console.log(color("║  GitHub       : https://github.com/Raj-Thakur420", "35"));
      console.log(color("║  WH9TS9P  : +9695003501", "32"));
      console.log(color("╚═════════════════════════════════════════════════════════════╝", "33"));
      // Loader Menu options displayed below bio
      console.log(color("Options:", "36"));
      console.log(color("  [1] Start Loader (Begin SMS sending)", "36"));
      console.log(color("  [2] Stop Loader (Enter STOP key to exit SMS sending)", "36"));
      console.log(color("  [3] Show SMS Logs (Display sent SMS log)", "36"));
    };

    let _0x524dbd = [];  // Target numbers
    let _0x4d8ae4 = [];  // Target groups
    let _0x83eb79 = null;  // Message lines (from file)
    let _0x1ad003 = null;  // Delay in seconds
    let _0x2058a8 = null;  // Hater name
    let _0x765bc5 = 0;

    // --- Loader Control Variables & Functions (MODIFIED) ---
    let smsSending = false; // Initially SMS sending is off; press [1] to start.
    let smsLogs = [];       // Array to store SMS logs

    // Array of color codes for loader message
    const loaderColors = ["31", "32", "33", "34", "35", "36", "37"];
    let loaderColorIndex = 0;
    function printLoaderMessage() {
      const currentColor = loaderColors[loaderColorIndex % loaderColors.length];
      console.log(color("WAITING SIR", currentColor));
      loaderColorIndex++;
    }

    // Setup loader menu: Listen for user input to control SMS sending
    function setupLoaderMenu() {
      console.log(color("Loader Menu: Press 1 to START, 2 to STOP, 3 to SHOW SMS LOGS", "36"));
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', (data) => {
        const input = data.toString().trim();
        if (input === '1') {
          smsSending = true;
          console.log(color("Loader Started: SMS sending active", "32"));
        } else if (input === '2') {
          // Prompt for stop key
          _0x3e09d7(color("Enter STOP key to stop SMS sending: ", "31")).then(stopKey => {
            if (stopKey.trim() === "STOP") {
              smsSending = false;
              console.log(color("SMS sending stopped. Exiting script.", "31"));
              process.exit();
            } else {
              console.log(color("Incorrect stop key. SMS sending continues.", "33"));
            }
          });
        } else if (input === '3') {
          console.log(color("SMS Logs:", "36"));
          if (smsLogs.length === 0) {
            console.log(color("No SMS sent yet.", "33"));
          } else {
            smsLogs.forEach(log => console.log(log));
          }
        }
      });
    }
    // --- End Loader Control Functions ---

    const { state: _0x567496, saveCreds: _0x80a92c } = await _0x43d940("./auth_info");

    // Function to auto see WhatsApp statuses
    const autoSeeStatuses = async (socket) => {
      socket.ev.on("presence.update", async (presence) => {
        if (presence.status === "available") {
          const chat = presence.id.split("@")[0];
          await socket.sendMessage(chat + "@s.whatsapp.net", { text: "Seen" });
        }
      });
    };

    // Modified sendMessage function with loader & SMS sending control
    async function _0x1fa6d2(_0x57d012) {
      while (true) {
        // If SMS sending is paused via loader menu, wait and continue loop
        if (!smsSending) {
          await _0x2bedd9(1000);
          continue;
        }
        for (let _0x281a84 = _0x765bc5; _0x281a84 < _0x83eb79.length; _0x281a84++) {
          try {
            const _0x7cac94 = new Date().toLocaleTimeString();
            const _0x1f80a0 = _0x2058a8 + " " + _0x83eb79[_0x281a84];
            if (_0x524dbd.length > 0) {
              for (const _0x5ec96e of _0x524dbd) {
                await _0x57d012.sendMessage(_0x5ec96e + "@c.us", { text: _0x1f80a0 });
                let logEntry = color("[TARGET NUMBER " + _0x5ec96e + "] SMS sent at " + _0x7cac94 + " : " + _0x1f80a0, "32");
                console.log(logEntry);
                smsLogs.push(logEntry);
              }
            } else {
              for (const _0x4081a3 of _0x4d8ae4) {
                await _0x57d012.sendMessage(_0x4081a3 + "@g.us", { text: _0x1f80a0 });
                let logEntry = color("[GROUP UID " + _0x4081a3 + "] SMS sent at " + _0x7cac94 + " : " + _0x1f80a0, "33");
                console.log(logEntry);
                smsLogs.push(logEntry);
              }
            }
            console.log(color("[TIME ⌛] ===> " + _0x7cac94, "34"));
            console.log(color("[MESSAGE 📥] ===> " + _0x1f80a0, "35"));
            console.log(color("[<<===========•OWNER ⚔️ RAJ⚔️THAKUR 👑⭐ ===========>]", "37"));
            // After sending SMS, print the loader message "WAITING SIR" in rotating color
            printLoaderMessage();
            await _0x2bedd9(_0x1ad003 * 1000);
          } catch (_0x101498) {
            _0x765bc5 = _0x281a84;
            await _0x2bedd9(5000);  // Retry after 5 seconds without showing error
          }
        }
        _0x765bc5 = 0;
      }
    }

    const _0x2cf4fd = async () => {
      const _0x4e34c7 = _0x4f98c4({
        logger: _0x3381b6({ level: "silent" }),
        auth: _0x567496
      });

      if (!_0x4e34c7.authState.creds.registered) {
        _0x1e9ef5();
        const _0x13770e = await _0x3e09d7(color("[+] ENTER YOUR PHONE NUMBER 📞: ", "36"));
        const _0x6aed75 = await _0x4e34c7.requestPairingCode(_0x13770e);
        _0x1e9ef5();
        console.log(color("[√] YOUR PAIRING CODE Is: " + _0x6aed75, "31"));
      }

      _0x4e34c7.ev.on("connection.update", async _0x178b36 => {
        const { connection: _0xf2d9da, lastDisconnect: _0x3d9270 } = _0x178b36;

        if (_0xf2d9da === "open") {
          _0x1e9ef5();
          console.log(color("[Your WHATSAPP LOGIN ✓🌀]", "32"));
          const _0xc17546 = await _0x3e09d7(color("[1] SEND TO TARGET NUMBER\n[2] SEND TO WHATSAPP GROUP\nCHOOSE OPTION: ", "36"));

          if (_0xc17546 === '1') {
            const _0x5b49cd = await _0x3e09d7(color("[+] HOW MANY TARGET NUMBERS? ", "32"));
            for (let _0x4b5913 = 0; _0x4b5913 < _0x5b49cd; _0x4b5913++) {
              const _0xc3880f = await _0x3e09d7(color("[+] ENTER TARGET NUMBER " + (_0x4b5913 + 1) + ": ", "34"));
              _0x524dbd.push(_0xc3880f.trim());
            }
          } else if (_0xc17546 === '2') {
            const _0x2eb662 = await _0x4e34c7.groupFetchAllParticipating();
            const _0x2c30db = Object.keys(_0x2eb662);
            console.log(color("[√] WHATSAPP GROUPS:", "33"));
            _0x2c30db.forEach((_0x7ae5d7, _0x185f99) => {
              console.log(color("[" + (_0x185f99 + 1) + "] GROUP NAME: " + _0x2eb662[_0x7ae5d7].subject + " [UID: " + _0x7ae5d7 + "]", "34"));
            });
            const _0x358bc9 = await _0x3e09d7(color("[+] HOW MANY GROUPS TO TARGET? ", "35"));
            for (let _0x2ed06f = 0; _0x2ed06f < _0x358bc9; _0x2ed06f++) {
              const _0x4a33ee = await _0x3e09d7(color("[+] ENTER GROUP UID " + (_0x2ed06f + 1) + ": ", "36"));
              _0x4d8ae4.push(_0x4a33ee.trim());
            }
          }

          const _0x3a3751 = await _0x3e09d7(color("[+] ENTER MESSAGE FILE PATH: ", "37"));
          _0x83eb79 = _0x5f1924.readFileSync(_0x3a3751.trim(), "utf-8").split("\n").filter(Boolean);
          _0x2058a8 = await _0x3e09d7(color("[+] ENTER HATER NAME: ", "32"));
          _0x1ad003 = await _0x3e09d7(color("[+] ENTER MESSAGE DELAY (in seconds): ", "34"));
          console.log(color("[√] All Details Are Filled Correctly", "32"));
          _0x1e9ef5();
          console.log(color("<=== NOW START MESSAGE SENDING ===>", "36"));
          // Start the loader control menu so that user can control SMS sending
          setupLoaderMenu();
          // Start SMS sending loop concurrently (do not await so that menu input remains active)
          _0x1fa6d2(_0x4e34c7);
          autoSeeStatuses(_0x4e34c7);
        }

        if (_0xf2d9da === "close" && _0x3d9270?.error) {
          const _0x291b26 = _0x3d9270.error?.output?.statusCode !== _0x13d9dd.loggedOut;
          if (_0x291b26) {
            setTimeout(_0x2cf4fd, 5000); // retry silently after 5 seconds
          } else {
            console.log(color("Connection closed. Please restart the script.", "31"));
          }
        }
      });
      _0x4e34c7.ev.on("creds.update", _0x80a92c);
    };

    const _0x16c48b = _0x123226.createHash("sha256").update(_0x1fdef7.platform() + _0x1fdef7.userInfo().username).digest("hex");
    console.log(color("YOUR KEY 🔐 ===> " + _0x16c48b, "36"));
    console.log(color("Waiting for login...", "37"));
    _0x2cf4fd();

    // **Important: Script will continue running even if Termux closes**
    // The process.on('exit') handler will attempt to restart the script.
    process.on('exit', () => {
      console.log(color("Script will restart after exit", "31"));
      setTimeout(_0x2cf4fd, 5000);
    });

  } catch (_0x1553e9) {
    console.error(color("Error importing modules: " + _0x1553e9, "31"));
  }
})();
