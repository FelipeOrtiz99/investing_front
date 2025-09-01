# Investment Management Frontend

Una aplicación web desarrollada en Angular 20 para la gestión de inversiones financieras. Esta aplicación permite a los usuarios gestionar clientes, fondos de inversión, transacciones y carteras de manera eficiente.

## Características principales

- **Gestión de Clientes**: Administrar información de clientes y sus estados
- **Fondos de Inversión**: Visualizar y gestionar diferentes fondos de inversión con sus monedas y montos mínimos
- **Transacciones**: Crear, visualizar y gestionar transacciones de inversión
- **Carteras**: Administrar las carteras de los clientes
- **Dashboard**: Panel de control con widgets informativos
- **Estados de Conexión**: Monitoreo del estado de conexión en tiempo real

## Tecnologías utilizadas

- Angular 20
- TypeScript
- SCSS/Tailwind CSS
- PrimeNG (para componentes UI)
- RxJS para programación reactiva

## Desarrollo

Para iniciar el servidor de desarrollo local, ejecuta:

```bash
ng serve
```

Una vez que el servidor esté ejecutándose, abre tu navegador y navega a `http://localhost:4200/`. La aplicación se recargará automáticamente cuando modifiques cualquier archivo fuente.

## Instalación

1. Clona el repositorio
2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm start
# o
ng serve
```

## Estructura del proyecto

```
src/
├── app/
│   ├── core/                    # Servicios centrales e interceptores
│   ├── layout/                  # Componentes de layout (sidebar, topbar, etc.)
│   ├── pages/                   # Páginas principales de la aplicación
│   │   ├── components/          # Componentes reutilizables
│   │   ├── dashboard/           # Panel de control
│   │   ├── domain/              # Interfaces y modelos de datos
│   │   └── service/             # Servicios de negocio
│   └── shared/                  # Componentes compartidos
├── assets/                      # Recursos estáticos y estilos
└── environments/                # Configuraciones de entorno
```

## Generación de código

Angular CLI incluye herramientas poderosas para generar código. Para generar un nuevo componente, ejecuta:

```bash
ng generate component component-name
```

Para ver una lista completa de esquemas disponibles (como `components`, `directives`, o `pipes`), ejecuta:

```bash
ng generate --help
```

## Construcción

Para construir el proyecto ejecuta:

```bash
ng build
```

Esto compilará tu proyecto y almacenará los artefactos de construcción en el directorio `dist/`. Por defecto, la construcción de producción optimiza tu aplicación para rendimiento y velocidad.

Para construcción de producción:
```bash
ng build --configuration production
```

## Pruebas

### Pruebas unitarias

Para ejecutar las pruebas unitarias con el ejecutor de pruebas [Karma](https://karma-runner.github.io), usa el siguiente comando:

```bash
ng test
```

### Pruebas end-to-end

Para pruebas de extremo a extremo (e2e), ejecuta:

```bash
ng e2e
```

Angular CLI no viene con un framework de pruebas end-to-end por defecto. Puedes elegir uno que se adapte a tus necesidades.

## Scripts disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run watch` - Construye en modo observación para desarrollo
- `npm run format` - Formatea el código usando Prettier
- `npm test` - Ejecuta las pruebas unitarias

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Añade nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## Recursos adicionales

Para más información sobre el uso de Angular CLI, incluyendo referencias detalladas de comandos, visita la página [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).

## Licencia

Este proyecto está bajo la licencia especificada en el archivo LICENSE.md.
