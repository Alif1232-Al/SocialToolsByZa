"use client";
import { Camera, Globe, MessageCircle, ExternalLink } from "lucide-react";

const SOCIAL_LINKS = {
  instagram: "https://instagram.com/popify_dev",
  threads: "https://threads.net/@popify_dev",
  linkedin: "https://www.linkedin.com/in/alif-afriza-973b612a5",
  kaggle: "https://www.kaggle.com/yukikatherina",
   whatsapp: "https://wa.me/6285177824235?text=Halo%20Za!%20Saya%20dari%20SocialToolsByZa",
};

export default function Footer() {
  const socialLinks = [
    { label: "Instagram", icon: Camera, href: SOCIAL_LINKS.instagram, color: "hover:bg-pink-500" },
    { label: "Threads", icon: ExternalLink, href: SOCIAL_LINKS.threads, color: "hover:bg-yellow-400" },
    { label: "LinkedIn", icon: Globe, href: SOCIAL_LINKS.linkedin, color: "hover:bg-cyan-500" },
    { label: "Kaggle", icon: ExternalLink, href: SOCIAL_LINKS.kaggle, color: "hover:bg-gray-300" },
    { label: "WhatsApp", icon: MessageCircle, href: SOCIAL_LINKS.whatsapp, color: "hover:bg-green-400" },
  ];

  return (
    <footer className="bg-gray-200 border-t-4 border-black mt-20">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <div className="text-center mb-10">
          <div className="inline-block bg-pink-500 text-white border-4 border-black px-6 py-2 -rotate-2 comic-shadow mb-4">
            <span className="font-display text-headline-md uppercase">THE CREW / CONTACT ME</span>
          </div>
          <p className="font-body text-body-md text-gray-700 max-w-lg mx-auto">
            Punya pertanyaan, kritik, atau pengen ngopi bareng? Temuin gue di sosmed bawah ini!
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 mb-10">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-16 h-16 border-4 border-black rounded-full flex items-center justify-center bg-white 
                         shadow-comic ${link.color} hover:scale-110 hover:shadow-comic-lg transition-all duration-200`}
              title={link.label}
            >
              <link.icon className="w-7 h-7" />
            </a>
          ))}
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t-2 border-black pt-6">
          <div className="font-display text-headline-md uppercase italic text-black">
            SOCIAL TOOLS BY ZA!!
          </div>
          <div className="flex gap-6">
            <span className="font-body font-bold uppercase text-sm text-gray-500 cursor-default">Terms</span>
            <span className="font-body font-bold uppercase text-sm text-gray-500 cursor-default">Privacy</span>
            <a href="mailto:hello@socialtoolsbyza.com" className="font-body font-bold uppercase text-sm text-gray-600 hover:text-black transition-colors">Contact</a>
          </div>
          <div className="font-body font-bold text-sm text-center md:text-right text-gray-600">
            LETTER TO THE EDITOR: &copy; 2026 ZA PRODUCTIONS
          </div>
        </div>
      </div>
    </footer>
  );
}
