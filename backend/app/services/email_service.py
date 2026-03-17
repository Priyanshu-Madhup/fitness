import smtplib
import asyncio
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

logger = logging.getLogger(__name__)

_DAY_COLORS = {
    "Monday": "#3b82f6",
    "Tuesday": "#8b5cf6",
    "Wednesday": "#10b981",
    "Thursday": "#f59e0b",
    "Friday": "#f43f5e",
    "Saturday": "#ec4899",
    "Sunday": "#64748b",
}


def _build_html_email(plan: dict) -> str:
    workout_days = plan.get("workout_days", [])
    nutrition_html = plan.get("nutrition_plan", "")
    tips_html = plan.get("tips", "")

    days_html = ""
    for d in workout_days:
        color = _DAY_COLORS.get(d["day"], "#6366f1")
        days_html += f"""
        <div style="margin-bottom:20px;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 1px 4px rgba(0,0,0,.06);">
            <div style="background:{color};padding:12px 18px;">
                <h3 style="margin:0;color:#fff;font-size:15px;letter-spacing:.5px;">{d["day"]}</h3>
            </div>
            <div style="padding:16px 18px;background:#fff;font-size:14px;line-height:1.7;color:#374151;">{d["html"]}</div>
        </div>"""

    return f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:680px;margin:32px auto;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.10);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);padding:36px 32px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:28px;letter-spacing:1px;">&#x1F4AA; Your FitAI Plan</h1>
      <p style="margin:10px 0 0;color:#e0e7ff;font-size:14px;">Personalised by AI &mdash; built for you</p>
    </div>

    <!-- Body -->
    <div style="background:#f9fafb;padding:28px 28px 8px;">

      <!-- Workout Section -->
      <h2 style="color:#1f2937;font-size:18px;border-bottom:2px solid #6366f1;padding-bottom:8px;margin-top:0;">
        &#x1F3CB; Weekly Workout Plan
      </h2>
      {days_html}

      <!-- Nutrition Section -->
      <h2 style="color:#1f2937;font-size:18px;border-bottom:2px solid #10b981;padding-bottom:8px;margin-top:28px;">
        &#x1F957; Nutrition Plan
      </h2>
      <div style="background:#fff;padding:18px;border-radius:12px;border:1px solid #e5e7eb;font-size:14px;line-height:1.7;color:#374151;">
        {nutrition_html}
      </div>

      <!-- Tips Section -->
      <h2 style="color:#1f2937;font-size:18px;border-bottom:2px solid #f59e0b;padding-bottom:8px;margin-top:28px;">
        &#x1F4A1; Tips &amp; Recommendations
      </h2>
      <div style="background:#fff;padding:18px;border-radius:12px;border:1px solid #e5e7eb;font-size:14px;line-height:1.7;color:#374151;">
        {tips_html}
      </div>

    </div>

    <!-- Footer -->
    <div style="background:#f3f4f6;padding:16px;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="margin:0;color:#9ca3af;font-size:12px;">Sent by <strong>FitAI</strong> &bull; Stay consistent, stay strong! &#x1F525;</p>
    </div>

  </div>
</body>
</html>"""


def _send_email_sync(email_address: str, app_password: str, plan: dict) -> None:
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "💪 Your FitAI Personalised Fitness Plan"
    msg["From"] = email_address
    msg["To"] = email_address

    html_body = _build_html_email(plan)
    msg.attach(MIMEText(html_body, "html"))

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.ehlo()
        server.starttls()
        server.login(email_address, app_password)
        server.sendmail(email_address, email_address, msg.as_string())
    logger.info("Plan email sent successfully to %s", email_address)


async def send_plan_email(plan: dict, email_address: str, app_password: str) -> None:
    if not email_address or not app_password:
        logger.warning("Email credentials not configured — skipping plan email.")
        return
    try:
        await asyncio.to_thread(_send_email_sync, email_address, app_password, plan)
    except Exception as exc:
        logger.error("Failed to send plan email: %s", exc)
