// Bibliothèque d'effets sonores et vibrations
const clickSoundBase64 = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUeA0OY5PO2dyMFl29GyD8';
const successSoundBase64 = 'data:audio/wav;base64,UklGRpRHAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAZGF0YXBHAAAAAGVudHJ5AAAA/v8AAAEAP/H/JQACABAAWQADAP//vgAEAAwAOQAFACIAEwAGAA4A5f8HAAgAfAAIABwAUwAJAP3/EgAKACQA+f8LAAYAo/8MAC0AXgANABIAHAAOAPj/0f8PAA0AbwAQACMASwARAP//CwASABoA9v8TAAcAnP8UAC8AXgAVABEAHAAWAPf/0P8XAAwAbgAYACIASgAZAP//CwAaABkA9f8bAAYAmv8cADAAXQAdABAAHAAeAPb/z/8fAAsAbQAgACEASQAhAP7/CwAiABgA9P8jAAUAmf8kADEAXAALAP//MgAvABkAHQAwAPX/zv8xAAsAbAAyACAAyf8BAPr/NAAXAPMABQCYADUAMgBbADYADgAcADcA9P/O/zgACgBrADkAHwDI/zgA/f86ABcA8gA6AAQAlwA7ADMAWgA8AA0AHAA9APP/zf8+AAkAagA/AB4AyP8/AP3/QAAWAPEAQAADAJYAQQAzAFkAQgAMABwAQwDy/8z/RAAIAGkARQAdAMf/RQD8/0YAFQDwAEYAAgCVAEcANABYAEgACwAcAEkA8f/L/0oABwBoAEsAHADH/0sA/P9MABQAugAAAAAAIgANAIEA3P8NACoAdgALAAYAFADQ/wEAmQD2/xIAJwDi/wcAewDm/w4AKADr/wYAgADV/w0AogD3/xUAJgDh/woAfgDm/xIAJgDr/wkAgQDV/xAAogD6/xgAJQDh/w0AgADn/xUAJQDs/wwAgwDW/xMAowD9/xsAIwDg/xAAggDo/xkAJADt/w8AhADX/xYApAABAB4AIgDf/xMAhADp/xwAIwDu/xIAhgDY/xkApQAFACEAIQDe/xYAhgDq/x8AIgDv/xUAiADZ/xwApgAJACQAIADd/xkAiADr/yIAIQDw/xgAigDa/x8ApwANACcAHwDc/xwAigDs/yUAIADx/xsAjADb/yIAqAARACsAHgDb/x8AjADt/ygAHwDy/x4AjQDc/yUAqQAVAC4AHQDa/yIAjgDu/ysAHgDz/yEAjwDd/ygAqgAZADEAHADZ/yUAkADv/y4AHQDz/yQAkQDe/ysAqwAdADQAGwDY/ygAkQDw/zEAHAD0/ycAkwDf/y4ArAAhADcAGgDX/ysAkwDx/zQAGwD1/yoAlQDg/zEArQAlADoAGQDW/y4AlQDy/zcAGgD2/y0AlwDh/zQArgApAD0AGADV/zEAlwDz/zoAGQD3/zAAmQDi/zcArwAtAEAAFwDU/zQAmQD0/z0AGAD4/zMAmwDj/zoAsAAxAEMAFgDU/zcAmwD1/0AAFwD5/zYAnQDk/z0AsQA1AEYAFQDTAAAAAgABAAQAAgADAAUAAwAFAAcABAAHAAkABQAJAAsABgALAA0ABwANAA8ACAAQABIACQASABQACgAUABYACwAWABgADAAZABsADQAbAB0ADgAdAB8ADwAgACIAEAAiACQAEQAkACYAEgAmACgAEwApACsAFAArAC0AFQAtAC8AFgAvADEAFwAyADQAGAA0ADYAGwA2ADgAHgA4ADoAIAA6ADwAIwA9AD8AJgA/AEEAKQBBAEMAKwBDAEUALgBGAEgAMQBIAEoANABKAEwANwBMAE4AOgBPAFEAPQBRAFMAPwBTAFUAQgBVAFcARABYAFoARwBaAFwASQBcAF4ATABfAGEATgBhAGMAAAA0AF8AGgC6/y4AyQAqACIAewBYAAYA1f9ZAGsAXQAWACEAzv9ZAGAAagAKAFcAKgAdAM8AZQAcAGoAbgA3ABIAUQCPACsAAAA=';
const errorSoundBase64 = 'data:audio/wav;base64,UklGRj4MAABXQVZFZm10IBAAAAABAAEAESsAABErAAABAAgAZGF0YQoMAACAgICAgICAgICAgICAgICAgICAgICFiY6TmZ+kqaywsrO0tbW1tLOxr62ppqGbl5CIgXpzcGpkXldRSkQ9NzAqIxwWDwkCAf7+/v8AAgUJDBEWGh8lKi4zOD1CRkpPU1ddYWVpbXFzeHyAhIiMkJOWmJudnqChoqOjpKSkpKOjoqKhoJ+enZybmpmYl5aVlJSUk5STlJSUlZaXmJqcnqGkp6qtsLO2ubzAw8XJzM/S1dnc4OPm6u3w9PX3+vz9/v8AAAABAgMEBQUFBgYGBgYGBQUFBAMDAgEAAAD+/fz7+vn49/b19PPy8fDv7u3t7Ovr6urq6urr6+zt7u/x8vT29/n7/f8BAwYICw0QEhUXGRwdHyEiJCUmJygpKSoqKysrKyoqKikpKCcmJSQjISAfHRwaGBYUEhAPDQsJBwUDAf/9+/n39fPx7+3r6efl5OLg3t3c2tnY19bW1dXV1tbX2Nnb3N7g4uTm6Ors7vDy9PX3+fr8/f7/AAAAAQECAgMDAwQEBAQEBAQEAwMDAwICAQEBAAAA///////////////////////+/v7+/v7+/v7+/v////////////////8AAAEBAgIDAwQEBQYGBwcICQkKCgoLCwsLCwsLCwoKCgkJCAgIBwcGBgUFBAMDAgEBAAAAAAAAAAABAgMFBggKDA4RExYYGx0gIiUoKiwvMjQ3OTs+QUNGS01QUlVXWVxeYGJkZmhqbG1vcXJzdHV2dnZ3d3d3d3Z2dXV0c3JxcG5ta2poZmRiYF5cWlhVU1FOS0hFQj89Ojg1MjAtKykmIyAdGhcUEQ8MCQcEAgD9+vj29PPw7evp5+Xj4d/d3Nrb29vc3d7g4uTm6Ovt8PP2+Pr9AAQHCQ0QExYZHB8iJCcpKy0uMDEyMzQ0NTU1NTU0NDMyMTAvLiwrKSgmJCIgHhsZFxQSDw0KCAUDAf/8+vj29PLv7evp5+Xj4d/e3Nva2tnZ2NjY2NjY2dnZ2tvc3d/g4uTm6Ors7vDy9Pb4+vz+AAIEBggKDA4QEhQWFxkaGxwdHh4fHx8gIB8fHx4eHR0cGxoZGBYVExIQDw0LCggGBAIA//38+vn39vTz8e/u7Ovq6ejn5+bl5eXl5OTl5eXm5+fp6uvs7vDx8/X3+fr8/gEDBQcJCw0PERMUFhcYGRobHBwdHR0eHh4eHh0dHRwcGxoaGRgXFhUTEhEPDgwLCQgGBAMA//79+/r5+Pb18/Lx7+7t7Ovr6uno6Ojn5+fn5+fo6Onp6urs7e7v8fL09fb4+vv9/wACBAUHCAoLDQ4QERITFBUWFhcXGBgYGBgYGBgYFxcXFhYVFBMSERAODQwKCQcGBAMBAP7+/Pv6+fj39vX08/Lx8O/v7u3t7Ozs6+vr6+vr6+zs7O3u7u/w8fLz9PX29/j6+/z+/wABAgMEBQYHCAkKCwsMDQ0ODg8PDw8QEBAQEBAQEBAPDw8PDg4NDQwMCwoJCQgHBgUEAwIBAP///v39/Pz7+/r6+fn5+Pj49/f39/f39/f39/f3+Pj4+fn5+vr7+/z8/f3+/v8AAQECAgMDBAQFBQYGBgcHBwgICAgICAgICAgICAgHBwcHBgYGBQUFBAQDAwMCAQEBAAAA///////////////+/v7+/v7+/v7+//////////////////////////////////8AAAAAAAABAgMDBAUGBwgJCQoLDA0ODg8QEBESEhMTExMUFBQUFBQUFBMTExMSEhIRERAQDw8ODg0MCwoKCQgHBwYFBAMDAgEAAAAAAP///v7+/f38/Pz7+/v6+vr6+fn5+fn5+fn5+fn5+fn6+vr6+vv7+/z8/P39/f7+/v///////wAAAAAAAAEBAQEBAQICAgICAgICAgICAgICAgICAQEBAQEBAAAAAAAAAP///////////////////////////////////////////////////////////wECBAUHCQsMDhATFRgaHR8iJCcpLC4xMzY4Oz0/QUNGSU1PUVNVVldYWVlaW1tcXFxcXFxcW1taWllYWFZVVFJQT01LSEdEQj89Ojg1MzEuLCkmJCEfHBkXFBIQDQsIBgMB/vv5+Pbz8e7s6ufl493b2dfV09LR0NDQ0NDR0dLT1NXX2drd3+Hi5efp7O3v8fP19/n7/f8CBQcJDA4RExUXGhweICIjJSYoKSorLCwtLS0tLS0tLSwsKyspKSgnJiUkIiEgHhwaGRcVExEPDQsJBwUDAf/9+/n39fPx7+3r6efm5OPi4uLi4uPj5OXm5+jr7e/x8/X3+fv9/wIEBgkLDQ8RExUWGBkaGxwdHh4fHx8gICAgICAgIB8fHx4eHR0cGxoZGBcWFRMSEA8NDAsJCAYFAwEA/v38+/r5+Pf39vb19fX09PT09PT09fX19vb39/j5+vr7/P3+/wECAwQFBgcICQoLCwwNDQ4ODw8PDw8QEBAQEBAPDw8PDg4ODQ0MDAsLCgkICAcGBQQEAwIBAP/+/v39/Pz7+/v6+vr6+fn5+fn5+fn5+fn5+fr6+vr6+/v7/Pz8/f3+/v7///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQICAwQFBQYHBwgJCQoKCwwMDAwNDQ0NDQ0NDQ0NDQ0MDAwLCwsKCgkJCAgHBwYGBQUEAwMCAgEBAAAAAAD//v7+/v39/f39/f39/f39/f39/f39/f39/f39/f3+/v7+/v///wAAAAAAAAEBAQECAgICAgMDAwMDAwMDAwMDAwMDAwMDAwMCAgICAgIBAQEBAQAAAAAAAAD////////////////////////////+/v7+/v7+/v7+/v7+/v/////////////////////////////////////////////+/v7+/v7+/v7+/v//AAEBAgMEBAUGBwgICQoLDA0NDg8PEBERERISEhMTExMTExMSEhIRERAQEA8PDg4NDAsLCgkICAcGBQUEAwICAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgQFBwkLDQ8RExUWGBobHB0eHyAhISIiIiMjIyMjIyMjIyIiIiEhIB8fHh0dHBsaGRgWFRQSEQ8ODAsJCAYFAwEA/v38+/r5+Pf29fX08/Pz8vLy8vLy8vLy8/P09PX19vf4+fr7/P3+/wECAwQFBgcICQoLDA0NDg8PEBAQEREREREREREREBAPDw8ODg0NDAsKCgkIBwcGBQQDAgIBAP/+/v39/Pz7+/v6+vr6+vn5+fn5+fn5+fn5+vr6+vr7+/v8/P39/f7+///'/////wAAAAECAwQFBgcICQoLDA0ODw8QEREREhISEhMTExMTExMSEhIR

// Système de gestion des sons et vibrations
export const SoundEffects = {
  // Jouer un effet sonore
  playSound: (soundType: 'click' | 'success' | 'error' | 'hover' = 'click', volume: number = 0.3) => {
    try {
      let soundBase64 = clickSoundBase64;
      
      // Sélectionner le son en fonction du type
      switch (soundType) {
        case 'success':
          soundBase64 = successSoundBase64;
          break;
        case 'error':
          soundBase64 = errorSoundBase64;
          break;
        case 'hover':
          // Son léger pour le survol
          soundBase64 = clickSoundBase64;
          volume = 0.1;
          break;
        default:
          soundBase64 = clickSoundBase64;
      }
      
      const audio = new Audio(soundBase64);
      audio.volume = volume;
      audio.play().catch(err => console.log('Lecture audio désactivée:', err));
    } catch (error) {
      console.log('Erreur lors de la lecture du son:', error);
    }
  },
  
  // Effet de vibration pour mobile
  vibrate: (pattern: number[] = [50, 30, 50]) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  },
  
  // Effet combiné son + vibration
  feedback: (type: 'click' | 'success' | 'error' | 'hover' = 'click') => {
    // Vibration adaptée au type de feedback
    const vibratePatterns = {
      click: [50, 30, 50],
      success: [50, 30, 50, 30, 100],
      error: [100, 50, 100],
      hover: [20]
    };
    
    SoundEffects.playSound(type);
    SoundEffects.vibrate(vibratePatterns[type]);
  },
  
  // Musique de fond
  backgroundMusic: {
    audio: null as HTMLAudioElement | null,
    isPlaying: false,
    
    init: () => {
      // Créer un élément audio pour la musique de fond
      const audio = new Audio();
      audio.src = 'https://cdn.discordapp.com/attachments/1371480769201045614/1384929834126909540/y2mate.is_-_Best_of_Lo_fi_Hip_Hop_Mix_Lofi_Chill_Music_2023_Lofi_Hip_Hop_to_Sleep_Study_Relax-3yqTrO3syjY-160k-1721321183.mp3?ex=6643ca73&is=6631ca73&hm=e9a33ab9c82b4a3c05dffef7f8608cc1ed96064151b37fef0b9c2a65462a5a8c&';
      audio.loop = true;
      audio.volume = 0.3;
      SoundEffects.backgroundMusic.audio = audio;
      
      // Ajouter un gestionnaire d'événements pour le chargement de la page
      document.addEventListener('DOMContentLoaded', () => {
        // Créer un bouton pour activer/désactiver la musique
        const musicToggle = document.createElement('button');
        musicToggle.className = 'fixed bottom-4 left-4 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-black/70 backdrop-blur-sm border border-purple-500/30 text-white hover:scale-110 transition-transform';
        musicToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>';
        
        musicToggle.addEventListener('click', () => {
          SoundEffects.backgroundMusic.toggle();
          SoundEffects.feedback('click');
        });
        
        document.body.appendChild(musicToggle);
      });
    },
    
    play: () => {
      if (SoundEffects.backgroundMusic.audio && !SoundEffects.backgroundMusic.isPlaying) {
        SoundEffects.backgroundMusic.audio.play().catch(err => console.log('Lecture de la musique désactivée:', err));
        SoundEffects.backgroundMusic.isPlaying = true;
      }
    },
    
    pause: () => {
      if (SoundEffects.backgroundMusic.audio && SoundEffects.backgroundMusic.isPlaying) {
        SoundEffects.backgroundMusic.audio.pause();
        SoundEffects.backgroundMusic.isPlaying = false;
      }
    },
    
    toggle: () => {
      if (SoundEffects.backgroundMusic.isPlaying) {
        SoundEffects.backgroundMusic.pause();
      } else {
        SoundEffects.backgroundMusic.play();
      }
    }
  }
};

// Initialiser la musique de fond
SoundEffects.backgroundMusic.init();

export default SoundEffects;