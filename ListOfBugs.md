As we are working with the calc-sheet, we are finding more things we would like to update/fix.  For example, in addition to the locking mentioned above, teams have reported the following concerns:

User closes tab while editing cell
User changes username while editing cell
Overly long usernames or formulas overflow cell
Newlines are allowed in user names
Certain symbols in usernames can allow text to escape onto the page
and you will find more!!!

Make sure your team is keeping track of these kinds of issues in a project backlog.  Write up three of these bugs (and/or others you find!) in a user story format:

As a user i expect <state behaviour> 
Issue with system based on the stated user story
Repo steps:  How do i repo the issue.  (What are the steps that i need to do to reproduce this issue)
For example: 
There was a bug that is now fixed where a user could edit a cell that did not belong to them.
Repo step: To reproduce the C bug (which is now fixed) you go to a cell that you are not editing and you click on C

# Bug Reports

## 1. User closes tab while editing cell (FIXED in this [PR](https://github.com/AnnabelleAB/CS5500-assignment3/pull/4))

### User Story:
As a user, I expect my edits to be saved or at least be prompted to save them when I accidentally close the tab.

### Issue:
The system does not save the edits or prompt the user when they close the tab while editing a cell.

### Repo Steps:
1. Navigate to the calc-sheet.
2. Start editing a cell.
3. Without saving or finalizing the edit, close the tab.
4. Reopen the tab and navigate back to the calc-sheet.
5. Observe that the edits are not saved.

---

## 2. User changes username while editing cell

### User Story:
As a user, I expect my edits to be associated with my initial username even if I change it while editing a cell.

### Issue:
The system associates the edits with the new username when a user changes their username while editing a cell.

### Repo Steps:
1. Navigate to the calc-sheet.
2. Start editing a cell.
3. While editing, navigate to the settings and change your username.
4. Finalize the edit and observe that the edit is associated with the new username.

---

## 3. Overly long usernames or formulas overflow cell

### User Story:
As a user, I expect usernames and formulas to fit within the cell boundaries without overflowing, regardless of their length.

### Issue:
The system does not handle overly long usernames or formulas well, causing them to overflow the cell.

### Repo Steps:
1. Navigate to the calc-sheet.
2. Enter a very long username or formula in a cell.
3. Observe that the text overflows the cell boundaries.

---

## 4. Newlines are allowed in user names

### User Story:
As a user, I expect my username to be displayed in a single line without any breaks or newlines.

### Issue:
The system allows newlines in usernames, causing unexpected display behavior.

### Repo Steps:
1. Navigate to the user registration page.
2. Enter a username with a newline character (e.g., "John\nDoe").
3. Save or register with this username.
4. Navigate to the calc-sheet or any other section where the username is displayed.
5. Observe that the username is displayed in multiple lines.

---

## 5. Certain symbols in usernames can allow text to escape onto the page

### User Story:
As a user, I expect my username to be displayed securely without any risk of code injection or unintended behavior due to special symbols.

### Issue:
The system does not properly sanitize or escape certain symbols in usernames, which can lead to text escaping onto the page or potential security vulnerabilities.

### Repo Steps:
1. Navigate to the user settings or registration page.
2. Enter a username with certain symbols or code snippets (e.g., "<script>alert('hacked');</script>").
3. Save or register with this username.
4. Navigate to the calc-sheet or any other section where the username is displayed.
5. Observe unintended behavior, such as a popup alert or text being displayed outside of its intended container.


---

## Testing (for the third bug):

1. **Test with a long username**: Enter a username that's at the maximum allowed length and ensure it fits within the cell.
2. **Test with a long formula**: Enter a formula that's at the maximum allowed length and ensure it fits within the cell.
3. **Test with special characters**: Enter a username or formula with various special characters and ensure they don't cause any overflow.
4. **Test with varying cell sizes**: Adjust the cell size and ensure that the text adjusts accordingly without overflowing.
5. **Test with different screen resolutions**: Check the appearance on different screen resolutions to ensure consistent behavior.


# Fix Report

### Bug Fix Description

**Issue:**
The application failed to save or prompt to save user edits when a tab was closed during cell editing within the calc-sheet. This resulted in data loss and a suboptimal user experience.

**Resolution:**
The implemented solution now automatically saves the current editing state to `localStorage` upon tab closure. This action prevents data loss when the tab is closed unexpectedly during cell editing.

**Implementation Details:**
- Integration of a `beforeunload` event listener on the window object that triggers the `saveCurrentState` method from the `SheetMemory` class.
- The `saveCurrentState` method serializes the current sheet state and commits it to `localStorage`.
- Restoration of the sheet state from `localStorage` upon tab re-access.

### Modified Files:
- `SheetMemory.ts`: Addition of the `saveCurrentState` method for state serialization.
- `SheetComponent.tsx`: Implementation of the `saveCurrentState` method invocation within the `beforeunload` event listener.

### Testing the Fix

**Unit Testing:**
- Creation of a test suite in `SheetMemory.test.ts` to verify the invocation of the `saveCurrentState` method when the `beforeunload` event is triggered.
- Mocking of the `localStorage.setItem` method to validate its call during the tab closure event.
- Initial test iterations focused on argument validation for `localStorage.setItem`, which were not conclusive.
- Subsequent tests were adjusted to verify the call to `localStorage.setItem`, confirming the method's execution.

**Manual Testing:**
- Execution of manual tests to ensure persistence of user edits upon tab closure.
- Replication of user actions, including cell editing and tab closure, followed by tab reopening to verify state retention.

### Reproduction Steps for Original Issue:
1. Open the calc-sheet.
2. Edit a cell without saving.
3. Close the tab.
4. Reopen the tab and return to the calc-sheet.
5. Note the absence of saved edits.

### Validation Steps for the Fix:
1. Open the calc-sheet.
2. Edit a cell.
3. Close the tab.
4. Reopen the tab and return to the calc-sheet.
5. Verify the restoration of edits.

The update ensures data preservation and enhances user experience by preventing unintended data loss. Feedback and additional test scenarios are invited to refine the solution further.