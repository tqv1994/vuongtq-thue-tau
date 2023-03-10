Facebook Messenger Customer Chat Plugin
=================

Introduction
------------
A lightweight module that adds the Facebook Messenger Customer Chat Plugin to your Drupal site.

For more information on this feature go to - https://developers.facebook.com/docs/messenger-platform/discovery/customer-chat-plugin

Installation & Configuration
------------------------------------

1. Ensure your domain is white-listed to use the Facebook Messenger platform - go to Facebook Page settings > Messenger Platform -> White-listed domains
2. Enable the module.
3. As a site admin, go to /admin/config/system/fb-messenger/customer-chat-plugin
4. Fill in the Facebook Page ID that will be used with the chat plugin. You can find this at the bottom of the page at www.facebook.com/<your_page_username>/about
5. Select if you'd like the chat plugin to be minimised when the page loads (recommended).
6. Only uncheck check the Include Javascript SDK checkbox if you're aware that it's already being included in your site.
7. You'll also need an App Id to use the SDK, you can create on here - https://developers.facebook.com/docs/apps/register
8. Add the locale of your site, defaults to en_US.
9. Hit save settings.
