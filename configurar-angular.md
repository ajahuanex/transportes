# Configuración Permanente de Angular CLI en Windows

## Problema
El comando `ng` no se encuentra porque Angular CLI no está en el PATH del sistema.

## Solución Temporal (Sesión Actual)
```bash
export PATH="$PATH:/c/Users/MTC-PUNO/AppData/Roaming/npm"
```

## Solución Permanente

### Opción 1: Variables de Entorno de Windows
1. Abrir **Panel de Control** → **Sistema y Seguridad** → **Sistema**
2. Hacer clic en **Configuración avanzada del sistema**
3. Hacer clic en **Variables de entorno**
4. En **Variables del sistema**, buscar **Path** y hacer clic en **Editar**
5. Hacer clic en **Nuevo** y agregar: `%APPDATA%\npm`
6. Hacer clic en **Aceptar** en todas las ventanas
7. Reiniciar la terminal

### Opción 2: Usar los Scripts Automáticos
```bash
# Para Windows Command Prompt
start-angular.bat

# Para Git Bash
./start-angular.sh
```

### Opción 3: Usar npx (Alternativa)
```bash
npx ng serve
```

## Verificación
```bash
ng version
```

## Ubicación de Angular CLI
- **Windows**: `C:\Users\MTC-PUNO\AppData\Roaming\npm\ng.cmd`
- **Variable**: `%APPDATA%\npm`

## Comandos Útiles
```bash
# Instalar Angular CLI globalmente
npm install -g @angular/cli

# Verificar instalación
ng version

# Iniciar servidor de desarrollo
ng serve

# Crear nuevo proyecto
ng new nombre-proyecto

# Generar componente
ng generate component nombre-componente
``` 