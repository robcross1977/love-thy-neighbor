# Restaurant

I want to make a new project that will be a generic restaurant project that we can easily customize for customers (restaurants).

## Tech Stack

1. NextJS
2. Supabase
3. Tailwind
4. ShadCN
5. https://supabase.com/blog/supabase-ui-library
6. GraphQL (restaurant)
7. Stripe

## Admin Section

A section where administrators can set up:

- the main image for the home page
- the restaurant name
- any tagline/slogan for the restaurant
- custom colors for the theme
- menu items + prices
- specials (triggers to change menu items or prices on particular days)
- Hours - we will not want a user to be able to put an order in any time they like, the owner should be able to designate hours
- An on/off toggle in case there is an emergency and they need to turn off online ordering.

## Main Page

A page that shows the main info for the restaurant, let's a user sign up to be able to order, and gives a link to the menu

## Menu Page

The menu that was set up and buttons to add things to an order.

- Also an order component that lets you drill down and customize things in an order
- A payment component that shows the order and asks to verify it

## Orders Page

A page for the restaurant to see orders that are made online and track the progress.
