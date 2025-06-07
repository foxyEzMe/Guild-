import { Crown, ExternalLink } from 'lucide-react';
import { FaDiscord, FaTrello, FaTiktok } from 'react-icons/fa';
import { Link } from 'wouter';

export function Footer() {
  const openExternalLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <footer className="relative z-10 bg-dark-surface border-t border-sky-blue/30 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Guild Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-sky-blue rounded-lg flex items-center justify-center">
                <Crown className="text-pure-black w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-sky-blue">Arise Crossover</span>
            </div>
            <p className="text-light-gray mb-6 leading-relaxed">
              La guilde d'élite de Roblox où passion et excellence se rencontrent. 
              Rejoignez notre communauté de joueurs dévoués et vivez des aventures épiques.
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => openExternalLink('https://discord.gg/FXs9vseQ7N')}
                className="w-10 h-10 bg-sky-blue/20 hover:bg-sky-blue/40 rounded-lg flex items-center justify-center transition-colors duration-300"
              >
                <FaDiscord className="text-sky-blue w-5 h-5" />
              </button>
              <button 
                onClick={() => openExternalLink('https://trello.com/b/BLAPKTRD/arise-crossover')}
                className="w-10 h-10 bg-sky-blue/20 hover:bg-sky-blue/40 rounded-lg flex items-center justify-center transition-colors duration-300"
              >
                <FaTrello className="text-sky-blue w-5 h-5" />
              </button>
              <button 
                onClick={() => openExternalLink('https://www.tiktok.com/@2yuki21?_t=ZN-8x0bToybuKo&_r=1')}
                className="w-10 h-10 bg-sky-blue/20 hover:bg-sky-blue/40 rounded-lg flex items-center justify-center transition-colors duration-300"
              >
                <FaTiktok className="text-sky-blue w-5 h-5" />
              </button>
              <button 
                onClick={() => openExternalLink('https://www.roblox.com/groups/arisecrossover')}
                className="w-10 h-10 bg-sky-blue/20 hover:bg-sky-blue/40 rounded-lg flex items-center justify-center transition-colors duration-300"
              >
                <ExternalLink className="text-sky-blue w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-sky-blue mb-4">Liens Rapides</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-light-gray hover:text-sky-blue transition-colors duration-300">Accueil</Link></li>
              <li><Link href="/members" className="text-light-gray hover:text-sky-blue transition-colors duration-300">Membres</Link></li>
              <li><Link href="/announcements" className="text-light-gray hover:text-sky-blue transition-colors duration-300">Annonces</Link></li>
              <li><Link href="/credits" className="text-light-gray hover:text-sky-blue transition-colors duration-300">Crédits</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold text-sky-blue mb-4">Contact</h4>
            <ul className="space-y-2 text-light-gray">
              <li><FaDiscord className="inline mr-2 text-sky-blue" />Discord: Arise Crossover</li>
              <li><span className="inline-block w-4 h-4 mr-2"></span>contact@arisecrossover.com</li>
              <li><ExternalLink className="inline mr-2 text-sky-blue w-4 h-4" />Roblox: AriseGuild</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-sky-blue/30 mt-8 pt-8 text-center">
          <p className="text-light-gray">
            © 2024 Arise Crossover. Tous droits réservés. | Créé avec ❤️ pour la communauté Roblox
          </p>
        </div>
      </div>
    </footer>
  );
}
