# Convenciones para entradas del blog

Estas reglas mantienen estable la importación desde Obsidian y permiten que el pipeline optimice las imágenes automáticamente.

## Archivos Markdown

- Guarda cada entrada como un archivo `.md` dentro de `content/posts` con el slug como nombre, por ejemplo: `mi-primer-post.md`.
- El frontmatter debe incluir, al menos:
  ```yaml
  title: "Título completo"
  description: "Resumen corto (140-160 caracteres)"
  date: "2025-11-17"
  author: "Tu nombre"
  category: "nextjs"
  tags: [nextjs, obsidian]
  cover: "/images/posts/mi-primer-post/cover.png"
  coverAlt: "Descripción corta de la portada"
  published: true
  ```

## Imágenes

- Coloca los assets en `public/images/posts/<slug>/`.
- En el Markdown referencia las imágenes usando rutas absolutas (recomendado):
  ```md
  ![Diagrama de arquitectura](/images/posts/mi-primer-post/diagram.png)
  ```
- Si usas rutas relativas como `./diagram.png`, el parser las convertirá automáticamente a la ruta anterior siempre que el archivo exista.
- El pipeline agrega `loading="lazy"`, `decoding="async"` y las dimensiones reales; si falta la imagen, la build mostrará una advertencia en consola.

## Portadas y miniaturas

- Usa el campo `cover` para la imagen destacada. Los componentes del blog utilizarán `next/image` con esos datos.
- Configura `coverAlt` para mejorar la accesibilidad y las tarjetas sociales.

## Recomendaciones adicionales

- Mantén los nombres de archivos e imágenes en minúsculas y sin espacios.
- Evita usar caracteres especiales en los slugs para garantizar URL limpias.
- Antes de publicar, ejecuta `pnpm test` para validar que no haya imágenes faltantes ni frontmatter incompleto.
