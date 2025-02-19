# React Native LMS with Strapi, Clerk & RevenueCat

This is a React Native LMS using a [Strapi](https://strapi.io/) backend for course content, [Clerk](https://go.clerk.com/1vaJMZL) for user authentication and [RevenueCat](https://www.revenuecat.com/docs/getting-started/installation/reactnative?utm_medium=sponsored&utm_source=youtube&utm_campaign=SimonGrimm) for in-app purchases.

Featured Packages:

- [Expo Router](https://docs.expo.dev/routing/introduction/) file-based navigation
- [Expo DOM Components](https://docs.expo.dev/guides/dom-components/) for supporting HTML content
- [Expo API Routes](https://docs.expo.dev/router/reference/api-routes/) for API calls
- [NativeWind](https://www.nativewind.dev/) for styling
- [Strapi](https://strapi.io/) for content management
- [Clerk](https://go.clerk.com/1vaJMZL) for user authentication
- [RevenueCat](https://www.revenuecat.com/docs/getting-started/installation/reactnative?utm_medium=sponsored&utm_source=youtube&utm_campaign=SimonGrimm) for subscription management
- [Blocks Renderer](https://github.com/strapi/blocks-react-renderer) for content blocks
- [Reanimated](https://docs.swmansion.com/react-native-reanimated/) 3 for animations
- [Expo Video](https://docs.expo.dev/versions/latest/sdk/video/) for video playback
- [Confetti](https://github.com/AlirezaHadjar/react-native-fast-confetti) for confetti animations
- [Sonner](https://gunnartorfis.github.io/sonner-native/) for toast notifications

## Setup

### Environment Setup

Make sure you have the [Expo CLI](https://docs.expo.dev/get-started/set-up-your-environment/) installed.

Because we are using pre-built and a custom development client, you should download [Android Studio](https://developer.android.com/studio) and [Xcode](https://developer.apple.com/xcode/) to your Mac. For more information on setting up your development environment, refer to the [Expo documentation](https://docs.expo.dev/workflow/android-studio-emulator/) for Android Studio and the [React Native documentation](https://reactnative.dev/docs/environment-setup?guide=native) for Xcode.

### App Setup
To build the app, perform the following steps:

1. Clone the repository
2. Run `npm install`
3. Run `npx expo prebuild`
4. Run `npx expo run:ios` or `npx expo run:android`

### API Routes

1. Deploy your project using [EAS Hosting](https://docs.expo.dev/eas/hosting/introduction/)
2. Update the `app.json` to include your Expo Router **origin**
3. Upload your local `.env` with `eas env:push --path .env`


## Strapi Setup

1. Clone the Strapi project from [here](https://github.com/Galaxies-dev/lms-api)
2. Run the project locally using `npm run start` or deploy using [Strapi Cloud](https://strapi.io/cloud)
3. Update the `.env` file of the React Native App with the correct Strapi URL and token




## RevenueCat Setup

1. Setup the RevenueCat project and connect it to your Appstore & Stripe account
2. Update the `.env` file of the React Native App with the correct RevenueCat API Key
3. Insert the RevenueCat identifier for your product in the Strapi CMS of a premium course

## Demo

<div style="display: flex; flex-direction: 'row';">
<img src="./screenshots/browse.gif" width=30%>
<img src="./screenshots/course.gif" width=30%>

</div>

## App Screenshots

<div style="display: flex; flex-direction: 'row';">
<img src="./screenshots/app1.png" width=30%>
<img src="./screenshots/app2.png" width=30%>
<img src="./screenshots/app3.png" width=30%>
<img src="./screenshots/app4.png" width=30%>
<img src="./screenshots/app6.png" width=30%>
<img src="./screenshots/app7.png" width=30%>

</div>

## Web Screenshots

<div style="display: flex; flex-direction: 'row';">
<img src="./screenshots/web1.png" width=40%>
<img src="./screenshots/web2.png" width=40%>
<img src="./screenshots/web3.png" width=40%>
<img src="./screenshots/web4.png" width=40%>
<img src="./screenshots/web5.png" width=40%>
<img src="./screenshots/web6.png" width=40%>


</div>

## Strapi Screenshots

<div style="display: flex; flex-direction: 'row';">
<img src="./screenshots/strapi1.png"  height=30%>
<img src="./screenshots/strapi2.png"  height=30%>
<img src="./screenshots/strapi3.png" height=30%>
<img src="./screenshots/strapi4.png" height=30%>
<img src="./screenshots/strapi5.png" height=30%>

</div>

## 🚀 More

**Take a shortcut from web developer to mobile development fluency with guided learning**

Enjoyed this project? Learn to use React Native to build production-ready, native mobile apps for both iOS and Android based on your existing web development skills.

<a href="https://galaxies.dev"><img src="banner.png" height="auto" width="100%"></a>