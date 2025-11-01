import dns from "dns/promises";
import net from "net";

export async function checkEmailSMTP(email: string): Promise<boolean> {
  const domain = email.split("@")[1];
  const mxRecords = await dns.resolveMx(domain);
  if (!mxRecords.length) return false;

  mxRecords.sort((a, b) => a.priority - b.priority);
  const mxHost = mxRecords[0].exchange;

  return await new Promise((resolve) => {
    const socket = net.createConnection(25, mxHost, () => {
      let step = 0;
      const commands = [
        `EHLO ${domain}\r\n`,
        `MAIL FROM:<test@${domain}>\r\n`,
        `RCPT TO:<${email}>\r\n`,
        `QUIT\r\n`,
      ];

      socket.setEncoding("utf-8");

      socket.on("data", (data) => {
        if (data.toString().startsWith("550")) {
          socket.end();
          return resolve(false);
        }

        if (step < commands.length) {
          socket.write(commands[step]);
          step++;
        } else {
          socket.end();
          return resolve(true);
        }
      });

      socket.on("error", () => resolve(false));
      socket.setTimeout(5000, () => {
        socket.end();
        return resolve(false);
      });
    });
  });
}
