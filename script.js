// script.js - Sistema completo de cambio de tema
document.addEventListener('DOMContentLoaded', function() {
    // ===== ELEMENTOS DEL DOM =====
    const themeToggle = document.getElementById('themeToggle');
    const moonIcon = themeToggle.querySelector('.fa-moon');
    const sunIcon = themeToggle.querySelector('.fa-sun');
    
    // Lista de TODAS las imágenes que cambiarán con el tema
    const siteLogo = document.getElementById('siteLogo');
    const heroImage = document.getElementById('heroImage');
    const footerLogo = document.getElementById('footerLogo');
    
    // Agrupar todas las imágenes en un array para procesarlas juntas
    const imagesToSwitch = [siteLogo, heroImage, footerLogo];
    
    // ===== CONFIGURACIÓN INICIAL =====
    // 1. Comprobar tema guardado en localStorage
    const savedTheme = localStorage.getItem('spotifyTheme');
    
    // 2. Comprobar preferencia del sistema
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // 3. Decidir tema inicial (guardado > sistema > oscuro por defecto)
    let currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    // ===== FUNCIONES PRINCIPALES =====
    /**
     * Aplica el tema a todo el sitio
     * @param {string} theme - 'light' o 'dark'
     */
    function applyTheme(theme) {
        // Aplicar clase al body
        if (theme === 'light') {
            document.body.classList.add('light-theme');
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'block';
        } else {
            document.body.classList.remove('light-theme');
            moonIcon.style.display = 'block';
            sunIcon.style.display = 'none';
        }
        
        // Cambiar todas las imágenes
        switchAllImages(theme);
        
        // Actualizar variable global
        currentTheme = theme;
        
        // Guardar en localStorage
        localStorage.setItem('spotifyTheme', theme);
        
        // Log para debugging (quitar en producción)
        console.log(`Tema cambiado a: ${theme}`);
    }
    
    /**
     * Cambia todas las imágenes según el tema
     * @param {string} theme - 'light' o 'dark'
     */
    function switchAllImages(theme) {
        imagesToSwitch.forEach(img => {
            if (img && img.tagName === 'IMG') {
                try {
                    const newSrc = theme === 'light' 
                        ? img.getAttribute('data-light') 
                        : img.getAttribute('data-dark');
                    
                    // Solo cambiar si la fuente es diferente
                    if (newSrc && img.src !== newSrc) {
                        img.src = newSrc;
                    }
                } catch (error) {
                    console.warn(`Error cambiando imagen: ${img.id}`, error);
                }
            }
        });
    }
    
    /**
     * Alterna entre temas claro/oscuro
     */
    function toggleTheme() {
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    }
    
    /**
     * Verifica que todas las imágenes existan
     */
    function checkImagePaths() {
        console.log('=== VERIFICANDO RUTAS DE IMÁGENES ===');
        
        imagesToSwitch.forEach(img => {
            if (img) {
                console.log(`Imagen: ${img.id}`);
                console.log(`  Ruta actual: ${img.src}`);
                console.log(`  Ruta light: ${img.getAttribute('data-light')}`);
                console.log(`  Ruta dark: ${img.getAttribute('data-dark')}`);
                
                // Verificar si las rutas son accesibles
                const testImage = new Image();
                testImage.onload = function() {
                    console.log(`  ✓ ${img.id} - Ruta VÁLIDA`);
                };
                testImage.onerror = function() {
                    console.error(`  ✗ ${img.id} - Ruta NO ENCONTRADA: ${this.src}`);
                };
                testImage.src = img.src;
            }
        });
    }
    
    // ===== EVENT LISTENERS =====
    // 1. Click en el interruptor
    themeToggle.addEventListener('click', toggleTheme);
    
    // 2. Tecla Enter/Espace para accesibilidad
    themeToggle.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleTheme();
        }
    });
    
    // 3. Escuchar cambios en la preferencia del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('spotifyTheme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
    
    // ===== INICIALIZACIÓN =====
    // Aplicar tema inicial
    applyTheme(currentTheme);
    
    // Verificar rutas (opcional - quitar en producción)
    setTimeout(checkImagePaths, 1000);
    
    // ===== FUNCIÓN EXTRA: Animación del interruptor =====
    let isAnimating = false;
    themeToggle.addEventListener('click', function() {
        if (!isAnimating) {
            isAnimating = true;
            this.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                this.style.transform = '';
                isAnimating = false;
            }, 200);
        }
    });
    
    // Mensaje de consola amigable
    console.log('✅ Sistema de temas cargado correctamente');
    console.log('🌙 Modo oscuro | ☀️ Modo claro');
    console.log('🖱️ Haz clic en el botón de la luna/sol para cambiar');
});