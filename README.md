# Challenge: Gatekeeper middleware *extension*

This is an extension to the GateKeeper Middleware challenge in Thinkful's *Web Development Bootcamp*.

This app has a piece of middleware and two endpoints, `/login`, and "`/` (homepage) 
- Gatekeeper middleware: The middleware will check for a cookie name `token`. Using the value of the token it will attempt to get the associated user. If a user match is found, then set the req.user and call `next()`.
- `/login` will parses request for a header with the name `x-username-and-password`. The value for that header should look like this: `user=user@somewhere.com&pass=password`. It will then attempt to find a user with that username and password. If the user is located, the object should be added to the request as `req.user`. If the user is found, then it should create a random number token and save the token to the user object and set a cookie. 
- `/` check if the req.user is set, if not it redirects to the `/login` page. If it does exist then it should return the first name, last name, user name, id, and position (aka job title) of the authenticated user. 

In order to parse the request header, you will need to use the `query-string` package, which  we've already added as a dependency for this app.

`query-string`'s `.parse` method allows us to turn a string that looks like this: `key1=val1&key2=val2&key3=val3` into:

```javascript
{
    key1: 'val1',
    key2: 'val2',
    key3: 'val3'
}
```

So in your middlware, you'll need to use it to get an object with the `user` and `pass` from the request header `x-username-and-password` (if this request header was sent at all!).

