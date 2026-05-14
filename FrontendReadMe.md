# what i have done in the frontend

i have created and styled the; home page, search page, create post page and profile page.

i incoorperated and styled the login page.

i have corrected some functionality issues in the favorite page, though there is alot still lagging on the page. i just tried to make sure the page works along with the other pages, utilizing the shared logic in the frontend/script.js

i have tried as musch as possible that all the pages i have worked on are responsive down to 312px (favorite page excluded)

i have made sure all the pages that include an icon taskbar share the same logic, likewise i am resposible for creating/styling and designing the header's and footer's

all the pages share a js file "script.js" for their logic and i am full responsible for all the code written in script.js file. i won't be explaining it here as i have already done so in the file itself with the help of comments.

no module have been used in the course of this project so far.

in the script.js file i have wrriten a code that gets coordinates for the users location when the user grant location access permission. can't get the acctual location name yet without the help of the backend or free api.

a logout button have recently been added to the home page to logout the user back to the login/signup page on clicked.


# What i have not done

the like, share and bookmark icon aren't responsive yet to users actions, 

the current website media displays are not actual accounts displays, since i am not using localstorage to store and retrieve data, i need the backend for all these to be made possible. just visual illustrations used to show how actual data will appear

i may be missing some things as far as the frontend functionality is concern due to the fact that the frontend haven't been merged with the backend yet.

# what i think still needs to be done

a lot has been done as far as the frontend is concern, but without actual data, user accounts, we can say the frontend is complete

we still need to merge the backend to the frontend and during the process some frontend fuctionality will be added e.g likes, favorites posts, and shares.

auth for the login page is still pending completion.

lastly we need the backend ready to be able to create individual accounts, handle logins, logouts, rendering feeds info. without the backend we won't know how to go about the missing or unfigured out frontend functionalities

# My suggestions on how the hirre app should handle auth

if the users has login's/ or signups, the program should should store thier credentials so next time they won't be ask to login or signup again the app will just pass the auth and open the home page unless when closing the app the users clicks on logout.

# things to note in the root directory of the frontend folder

the login.hmtl and favourite page have been recreated and named as index.html and favorite respectively and as such are not used by the hirer app and should be deleted(login and favourite).

