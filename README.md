![Mastopoet Banner, AI generated, by @rolle@mementomori.social](https://raw.githubusercontent.com/raikasdev/mastopoet/main/public/mastopoet.png)

# Mastopoet

The post screenshot tool for Mastodon. Developed by [@raikas@mementomori.social](https://mementomori.social/@raikas)

## What?

Mastopoet is an open source screenshot tool for [Mastodon](https://joinmastodon.org), inspired by [poet.so](https://poet.so).
It allows you to create ✨ stunning ✨ screenshots of your posts, with ability to remove stuff you don't want (bookmark button, publicity symbol, settings button...). And with a theme that's not dependent on the theme of the instance!

## Demo

[mastopoet.ohjelmoi.fi](https://mastopoet.ohjelmoi.fi)

## URL Query feature

Add ?url=<post url> to the end of the Mastopoet URL to generate links that immediately open the post on Mastopoet.

## Themes available

- [Bird UI](https://github.com/ronilaukkarinen/mastodon-bird-ui) (Dark, Light)
- Mastodon (Dark, Dark + light interaction labels, Light)

## Images/profile pictures not working?

This is due to CORS. I cannot do anything about it, as the whole process is done client-side.

If you want to get Mastopoet working on your instance, contact your admin and ask them to allow anonymous CORS (crossOrigin: "anonymous") requests for their Mastodon media server.

**For admins** this means they need to add the `Access-Control-Allow-Origin` header to the server providing your users with images hosted on Mastodon. You can set it to '\*', or allow just Mastopoet with 'https://mastopoet.ohjelmoi.fi'. There's more technical information on [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image).

## Deploying

You can use Docker (instructions below), or simply host the website on a static platform. Mastopoet is a React SPA, compiled by Vite, allowing it to be deployed to pretty much any hosting service. My recommendations are Cloudflare Pages, Netlify and Github Pages.

First, install dependencies with `npm install` and then build the app with `npm run build`. Simple as that! The application is in the `dist` directory.

### Ko-fi advert

By default, the default post shows a link to my Ko-fi profile. If you want to disable it, you can customize the defaultPost in `src/config.ts`, or set environment value `VITE_HIDE_DEVELOPER_KOFI_AD` to false. I appreciate if you decide to keep it.

## Building with docker

You can use docker for deploying a production ready instance of Mastopoet.

You can build with:

```console
docker build -t mastopoet .
```

It will build the application and deploy in an nginx instance, when the image is built you can run using:

```console
docker run -d -p 80:80 mastopoet
```

For more options, see [nginx container options at dockerhub](https://hub.docker.com/_/nginx)

## TODO

- [x] Customizable gradient
- [x] Bird UI light theme port
- [x] Mastodon theme port
- [ ] Customizable date format
- [x] A logo (to website embed)
- [x] Read toot URL from query
- [x] Default toot with information
- [x] Fix multi image image galleries
- [ ] Support for non-Mastodon links
- [x] Alt text generator
- [ ] PDF export with link ([idea](https://mementomori.social/@JMTee@mstdn.social/110790253659999588))
- [x] Detect CORS failed images and show user info box
- [ ] If toot div is not an full integer, weird bars show in image.

## Credits

- [Mastodon Bird UI](https://github.com/ronilaukkarinen/mastodon-bird-ui/) by Roni Laukkarinen, licensed under MIT
- [Mastodon](https://github.com/mastodon/mastodon)
- [Tabler Icons](https://tabler-icons.io), licensed under MIT
- The beautiful AI generated OpenGraph image, created by [Roni Laukkarinen](https://mementomori.social/@rolle)
