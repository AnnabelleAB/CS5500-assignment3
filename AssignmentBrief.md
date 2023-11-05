It is time to strike out on your own and make your spread sheet more collaborative.  Sharing is great---but we have recently learned that it also comes along with concurrency, which sometimes gives us more to think about...  For example, multiple people editing the same cell requires some kind of "locking".  Bilbo Buggins left us some code that almost worked, but not quite!

In our meeting with PatLinks to an external site., one of the topics that we heard several times from your groups was that we would like to have a chat feature in our spreadsheet.  That might be a great way to start with collaboration!

## The Requirements
1. Each document should have a chat window in the spreadsheet editor page.
2. Each participant will see a entry pane that they can enter text into.
3. The server maintains the ordered list of chat items (to keep it simple!).
4. Each Chat item looks like this
 - user:  message
5. The client displays the latest 20 items. 
6. (Advanced topic). The client window provides a method for requesting more chat items and then they are added to the chat window (again, to keep it simple!). 
 - This means your chat server calls should provide a paged fetch method for the messages (details to follow in class!).
This description of the task is typical of the kind of request you might get as a team in industry.   You are expected to own the design and implementation of the whole feature.  For this assignment, we have asked you to design the feature up front and get approval for the plan prior to your execution.  Basically you need to execute a discovery phase, then you will do an implementation step, which will give you a good workout in an agile experience. 

*Discovery* is the stage where you study the requirements and you determine

- The user requirements (break down the request into user stories)
- The testing requirements, how will you know your user story has been satisfied.
- The sign off from the client that these user stories are sufficient
Implementation is when you write the code to implement all of the above.

## Your deliverables are as follows
1. You must provide a high level design document that details how you are going to solve it and what work is being done by each team member.  This is due on nov 6 (This should 3.3.overview the architecture of your new system in relationship to the existing system).
2. You provide a list of the user storiesLinks to an external site. that you are going to implement.  Nov 6.
3. You must provide a testing document.  In this document you will detail how you have tested your system, in particular each user story should have a set of tests defined (end2end, integration, unit) as you see fit so that you are confident you have a working system.  This is due on November 6.
4. You must deploy your server to a RenderLinks to an external site. server.  It is recommended that you get your system up on render early.   We will test on November 20.

## Rubric: 
https://northeastern.instructure.com/courses/162613/assignments/2042483

## But What about the Bugs?!?

As we are working with the calc-sheet, we are finding more things we would like to update/fix.  For example, in addition to the locking mentioned above, teams have reported the following concerns:

- User closes tab while editing cell
- User changes username while editing cell
- Overly long usernames or formulas overflow cell
- Newlines are allowed in user names
- Certain symbols in usernames can allow text to escape onto the page
and you will find more!!!

Make sure your team is keeping track of these kinds of issues in a project backlog.  Write up three of these bugs (and/or others you find!) in a user story format:

- As a user i expect <state behaviour> 
- Issue with system based on the stated user story
- Repo steps:  How do i repo the issue.  (What are the steps that i need to do to reproduce this issue)
For example: 
  - There was a bug that is now fixed where a user could edit a cell that did not belong to them.
Repo step: To reproduce the C bug (which is now fixed) you go to a cell that you are not editing and you click on C

In your final submission you will pick one bug (not the C bug) and fix it. Please provide a list of the tests you implemented/did to verify your fix is working.
