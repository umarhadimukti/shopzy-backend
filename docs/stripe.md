### Stripe Documentation

#### Stripe webhooks
1. Setup stripe CLI
```sh
brew install stripe/stripe-cli/stripe
```
```sh
stripe login
```
```sh
stripe listen --forward-to http://localhost:3001/api/checkout/webhook
```
2. Go to stripe dashboard (check)
```sh
Stripe website > Dashboard > Developers > Webhooks
```

3. Create webhook service & controller
*checkout.controller.ts*
```js

```
*checkout.service.ts*
```js

```