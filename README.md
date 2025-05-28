# MH2025: Mental Health Journaling and Peer Support Platform

## **CURRENTLY STILL IN BUILD**


MH2025 is an anonymous, secure, and supportive web platform that empowers users to express themselves through journaling, connect with peers for support, and access helpful resources—all within a safe, moderated environment.

## Features

- **Private Journaling:** Write freely with timestamped, private journal entries.
- **Anonymous Peer Support:** Connect in group chats or 1:1 conversations without revealing your identity.
- **AI-Powered Moderation:** Automatically flags content related to crisis, self-harm, or abuse and directs users to support resources.
- **User Safety First:** End-to-end user protection via JWT authentication, rate-limiting, and moderation pipelines.
- **Mobile-Ready UI:** Clean, friendly, and responsive interface built with Tailwind CSS and Next.js.

## Vision

We believe everyone deserves a safe space to talk, reflect, and heal—especially those struggling silently. MH2025 is a digital sanctuary where mental health is respected, voices are heard, and peer connection is made possible without stigma or judgment.

## Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Realtime)
- **Authentication:** Custom username/password with secure recovery keys
- **Moderation:** OpenAI-integrated flagging for sensitive content
- **Hosting:** Vercel (or any preferred provider)

## Getting Started

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/mh2025.git
cd mh2025
```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure environment variables:**

Create a `.env.local` file and add:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret_key
```

4. **Run the development server:**

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Screenshots

<!-- Add screenshots/gifs here -->
*(Coming soon)*

## Project Structure

```
/
├─ app/               # Next.js App Router pages
├─ components/        # Reusable UI components
├─ lib/               # Supabase client, utilities, and helpers
├─ context/           # Global auth and app context providers
├─ styles/            # Tailwind configuration
├─ types/             # TypeScript type definitions
```

## Contributing

We welcome contributions that align with our core mission of creating a safer space for mental health support.

1. Fork the repository
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the [MIT License](LICENSE).

## Support & Resources

MH2025 is not a substitute for professional mental health care. If you or someone you know is in crisis, please seek immediate help through your local emergency services or trusted mental health providers.

---

**MH2025** – Speak freely. Heal safely. Connect anonymously.
