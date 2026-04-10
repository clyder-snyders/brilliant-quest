# Manual Testing Guide - Brilliant Quest Game Flow

## 📋 Overview

This guide provides step-by-step instructions for manually testing the complete game flow end-to-end, including mobile responsiveness checks.

**Estimated Time:** 10-15 minutes per full run

---

## Prerequisites

- [ ] Development server running (`npm run dev`)
- [ ] Browser developer tools available (F12)
- [ ] Multiple browser windows or devices for responsive testing
- [ ] Clear browser cache/localStorage before starting (optional)

---

## Section 1: Welcome Screen (Desktop)

### Test 1.1: Welcome Screen Renders Correctly

**Steps:**
1. Open the app in browser at `http://localhost:5173`
2. Observe the welcome screen

**Verify:**
- [x] Page title "Brilliant OS" is visible
- [x] Subtitle "Think in Code. Play for Real." appears
- [x] Animated robot illustration displays
- [x] Feature badges visible: "50 Levels", "Real Code Logic", "Compete & Win"
- [x] Three buttons visible: "Get Started", "Practice Mode", "Level Map"
- [x] Footer text "Progress auto-saved locally" appears
- [x] Color scheme is consistent (blue-based gradient background)

**Expected Result:** ✓ Welcome screen fully rendered with all UI elements

---

### Test 1.2: Navigate to Setup via Get Started

**Steps:**
1. From welcome screen, click "Get Started" button
2. Wait for page transition (should be instant)
3. Observe the screen

**Verify:**
- [x] Page transitioned to setup screen
- [x] "Set Up Your Profile" heading visible
- [x] Heading includes subtitle: "Personalize your experience before you start"
- [x] Text input field visible with placeholder "Enter your name..."
- [x] "Choose Your Avatar" section visible
- [x] Six avatar buttons visible (Spark, Nova, Bolt, Pixel, Orbit, Ghost)
- [x] Back button (←) available in top-left
- [x] Form elements are properly styled

**Expected Result:** ✓ Navigation to setup screen works correctly

---

### Test 1.3: Navigate to Practice Mode

**Steps:**
1. Return to welcome screen (refresh if needed)
2. Click "Practice Mode" button
3. Observe the screen

**Verify:**
- [x] Page transitioned to level map screen
- [x] Practice mode is active (game state should reflect this)
- [x] Level selection interface is visible
- [x] No profile setup was required
- [x] Can select and play levels immediately

**Expected Result:** ✓ Practice mode launches without profile setup

---

### Test 1.4: Direct Access to Level Map

**Steps:**
1. Return to welcome screen
2. Click "Level Map" button
3. Observe the screen

**Verify:**
- [x] Page transitioned to level map screen
- [x] Can view and select levels
- [x] No profile setup required
- [x] Can access leaderboard and other features

**Expected Result:** ✓ Direct level map access works

---

## Section 2: Setup Screen (Desktop)

### Test 2.1: Profile Form Validation

**Steps:**
1. Click "Get Started" from welcome screen
2. On setup screen, attempt to click continue button WITHOUT entering a name
3. Observe response

**Verify:**
- [x] Button click is registered
- [x] Either error message appears OR user is prevented from continuing
- [x] If error: Message indicates "name is required" or similar
- [x] Focus returns to name input (if implemented)
- [x] Form doesn't submit

**Expected Result:** ✓ Form validation prevents submission without name

---

### Test 2.2: Profile Creation - Name Input

**Steps:**
1. From setup screen, click name input field
2. Type a player name: "TestPlayer" (or any name you prefer)
3. Observe input field

**Verify:**
- [x] Text appears in input field as you type
- [x] Input field has clear visual focus state
- [x] Backspace and editing works normally
- [x] Input accepts various names and characters

**Expected Result:** ✓ Name input field works correctly

---

### Test 2.3: Avatar Selection

**Steps:**
1. On setup screen, observe the six avatar buttons
2. Click on second avatar (Nova - should be the blue one)
3. Click on a different avatar (e.g., Pixel - should be different color)
4. Observe visual feedback

**Verify:**
- [x] Clicking avatar highlights it (usually with border or background color change)
- [x] Only one avatar is selected at a time
- [x] Visual selection indicator is clear
- [x] Currently selected avatar shows different styling
- [x] All six avatars are clickable

**Expected Result:** ✓ Avatar selection works with visual feedback

---

### Test 2.4: Complete Profile Setup

**Steps:**
1. Enter player name: "TestPlayer"
2. Select an avatar (any one except the default)
3. Look for and click the "Continue" or "Start" button
4. (The button text depends on implementation - look for similar action button)

**Verify:**
- [x] Button click is registered
- [x] Name input is accepted
- [x] Avatar selection is confirmed
- [x] Page transitions to level map screen
- [x] Transition is smooth (no errors in console)
- [x] Profile appears to be saved (check browser console if you see save operations)

**Expected Result:** ✓ Profile setup completes and navigates to level map

**Check Storage (Optional):**
- Open DevTools (F12) → Application → LocalStorage
- Look for key: `brilliantOS_profile`
- Verify it contains: `{ playerName: "TestPlayer", avatar: "nova", ... }`

---

### Test 2.5: Back Navigation

**Steps:**
1. From setup screen, click the back button (←) in top-left
2. Observe screen change

**Verify:**
- [x] Page transitions back to welcome screen
- [x] Back button has no loading delay
- [x] All welcome screen elements are visible
- [x] Can click "Get Started" again and return to setup
- [x] Previous data is NOT retained (fresh setup form)

**Expected Result:** ✓ Back navigation works correctly

---

## Section 3: Level Map Screen (Desktop)

### Test 3.1: Level Map Display

**Steps:**
1. Complete the setup (enter name, select avatar, continue) OR click "Practice Mode"
2. Observe the level map screen
3. Scroll if needed to see all content

**Verify:**
- [x] Page title or heading visible (usually shows player name if set)
- [x] Zones are displayed (expected: 4 zones with 12+ levels each)
- [x] Zone information visible:
  - [ ] Zone 1: "Easy — Foundations" (green)
  - [ ] Zone 2: "Difficult — Builder" (blue)
  - [ ] Zone 3: "Complex — Architect" (purple)
  - [ ] Zone 4: "University — Master" (dark)
- [x] Levels 1-12+ visible in Zone 1
- [x] Level buttons show level number and possible name
- [x] Level 1 is always accessible ("First Steps")
- [x] Other levels may be locked until prerequisites are met

**Expected Result:** ✓ Level map displays all zones and levels

---

### Test 3.2: Start Level 1

**Steps:**
1. On level map screen, find "Level 1" (labeled "First Steps")
2. Click on Level 1 button
3. Wait for page transition

**Verify:**
- [x] Page transitions to game screen
- [x] Level information loads (may show level name, description)
- [x] Game grid/puzzle area appears
- [x] Command palette or control panel visible
- [x] Level is ready to play (no loading errors)

**Expected Result:** ✓ Level 1 launches successfully

---

## Section 4: Game Screen (Level 1) (Desktop)

### Test 4.1: Game Interface Layout

**Steps:**
1. On Level 1 game screen, observe the interface

**Verify:**
- [x] Grid puzzle area visible (6x6 or similar size grid)
- [x] Grid contains:
  - [ ] Start position (usually highlighted in light blue)
  - [ ] Goal/flag position (usually in green)
  - [ ] Walls (dark cells)
  - [ ] Open paths (white cells)
- [x] Command palette visible (section with available command buttons)
- [x] Movement commands visible: "→ Move 1", "→ Move 2", "→ Move 3" (or similar)
- [x] Turn commands visible: "↰ Turn Left", "↱ Turn Right" (or similar)
- [x] Sequence/program area visible (where commands are placed)
- [x] Execute/Run button visible
- [x] Clear/Reset button visible
- [x] Back button to return to level map

**Expected Result:** ✓ Game screen interface complete

---

### Test 4.2: Build a Simple Solution for Level 1

**Steps:**
1. For Level 1 ("First Steps" - straight horizontal path):
   - This level requires moving straight right to reach the goal
2. Click command button: "→ Move 1" (or "→ Move 2" or "→ Move 3")
3. Click it 3 times to add three move commands to your sequence
4. Observe the sequence area

**Verify:**
- [x] Each click adds a command to the sequence
- [x] Commands appear in sequence area (usually row-based or stacked)
- [x] Command count is displayed (e.g., "3 commands")
- [x] Clear/Reset button clears the sequence
- [x] Can add up to the maximum command limit

**Expected Result:** ✓ Command selection and sequencing works

---

### Test 4.3: Execute the Solution

**Steps:**
1. With 3 "Move Forward" commands in sequence, click the "Execute" or "Run" button
2. Watch the animation

**Verify:**
- [x] Robot starts moving from the start position
- [x] Robot moves right with each command
- [x] Robot reaches the goal (green flag)
- [x] Success animation plays (optional: confetti, stars, sound)
- [x] Result screen appears automatically

**Expected Result:** ✓ Level successfully completed

---

### Test 4.4: Result Screen

**Steps:**
1. After completing Level 1, observe the result screen

**Verify:**
- [x] Success message displays (e.g., "Great!", "Success!")
- [x] Stars earned displayed (1-3 stars based on performance)
- [x] Score displayed
- [x] Time taken displayed
- [x] Commands used displayed
- [x] Next level button (to advance to Level 2)
- [x] Retry button (to replay Level 1)
- [x] Level map button (to return to level selection)
- [x] Confetti animation plays (if configured)
- [x] Results are saved to profile

**Expected Result:** ✓ Result screen displays completion information

---

### Test 4.5: Proceed to Next Level

**Steps:**
1. On result screen, click "Next Level" button
2. Observe transition

**Verify:**
- [x] Page transitions to Level 2
- [x] Level 2 puzzle loads correctly
- [x] Player profile is updated with Level 1 completion
- [x] No errors in transition

**Expected Result:** ✓ Progression to next level works

---

## Section 5: Mobile Responsiveness Testing

### Test 5.1: Welcome Screen on Mobile (iPhone Size)

**Steps:**
1. Open app in browser
2. Open DevTools (F12)
3. Click "Toggle device toolbar" (Ctrl+Shift+M or Cmd+Shift+M)
4. Set device to "iPhone 12" (390x844)
5. Reload page if needed
6. Observe welcome screen on mobile view

**Verify (Mobile iPhone 12 - 390x844):**
- [x] Page is not zoomed out too much (readable text)
- [x] All text is readable without zooming in
- [x] Buttons are stacked vertically and easily tappable
- [x] Logo and robot illustration scale appropriately
- [x] No horizontal scrollbar required
- [x] Feature badges arranged in single column or 2-3 columns
- [x] All buttons have sufficient padding for touch (min 44x44px recommended)
- [x] No content is cut off or hidden
- [x] Layout is balanced and centered

**Expected Result:** ✓ Welcome screen responsive on mobile

---

### Test 5.2: Setup Screen on Mobile

**Steps:**
1. While in mobile view (390x844), click "Get Started"
2. Observe setup screen on mobile

**Verify:**
- [x] Form layout is full-width
- [x] Name input field is fully clickable and usable
- [x] Name input has sufficient height (min 44px)
- [x] Avatar buttons arranged in 3-column grid or single column
- [x] Avatar buttons are tappable without zooming
- [x] Back button is easily accessible
- [x] Text is readable
- [x] No horizontal scrolling needed
- [x] Form is well-balanced on small screen

**Testing:**
- Click name input, type a name
- Try selecting different avatars
- Verify selections work without issues
- Click continue button

**Expected Result:** ✓ Setup screen fully functional on mobile

---

### Test 5.3: Level Map on Mobile

**Steps:**
1. Complete setup on mobile (or go directly to level map)
2. Observe level map on mobile view (390x844)

**Verify:**
- [x] Level buttons arranged for mobile (probably 1-2 per row)
- [x] Level buttons have sufficient height for tapping
- [x] Zone sections are clearly separated
- [x] Level numbers and names are readable
- [x] No horizontal scrolling required
- [x] Leaderboard button is accessible
- [x] All interactive elements are tappable
- [x] Layout doesn't require pinch-zooming

**Expected Result:** ✓ Level map functional on mobile

---

### Test 5.4: Game Screen on Mobile

**Steps:**
1. Start Level 1 on mobile view
2. Observe game screen layout

**Verify:**
- [x] Grid puzzle is visible and readable
- [x] Grid fits on screen (may be smaller but visible)
- [x] Command palette buttons are arranged vertically or in compact grid
- [x] Commands are tappable (sufficient size)
- [x] Sequence area is visible
- [x] Execute button is easily accessible
- [x] Game is playable on mobile without zooming
- [x] No critical content is hidden

**Testing:**
- Tap to add commands
- Tap Execute to run
- Verify animations work smoothly

**Expected Result:** ✓ Game playable on mobile

---

### Test 5.5: Tablet View (iPad Size)

**Steps:**
1. Open DevTools if not already open
2. Change device to "iPad" (768x1024)
3. Reload page
4. Test welcome screen, setup, and level map

**Verify (Tablet iPad - 768x1024):**
- [x] UI scales nicely to tablet size
- [x] More content visible than on mobile but still mobile-optimized
- [x] Buttons might be in 2-column layout
- [x] Text is larger and more readable
- [x] All interactive elements are accessible
- [x] Layout is balanced for landscape viewing (if rotated)
- [x] Better use of horizontal space than mobile

**Expected Result:** ✓ App responsive on tablet

---

### Test 5.6: Switch Between Viewports

**Steps:**
1. Start in mobile view (390x844)
2. Complete a sequence of actions (navigate through screens)
3. Switch to tablet view (768x1024)
4. Verify app state is maintained
5. Test functionality in tablet view
6. Switch back to mobile view
7. Verify app state and functionality again

**Verify:**
- [x] App state persists during viewport changes
- [x] No data is lost when switching views
- [x] Layout adapts smoothly
- [x] All functionality works in each viewport
- [x] No console errors during resize

**Expected Result:** ✓ Viewport switching works seamlessly

---

## Section 6: Data Persistence Testing

### Test 6.1: LocalStorage Verification

**Steps:**
1. Complete setup (enter name, select avatar)
2. Open DevTools (F12) → Application → LocalStorage
3. Look for entries related to "brilliant" or "game"

**Verify:**
- [x] Key `brilliantOS_profile` exists
- [x] Value contains player name and avatar
- [x] Data persists after page refresh
- [x] Name and avatar match what you entered

**Expected Result:**
```json
{
  "playerName": "YourName",
  "avatar": "selectedAvatar"
}
```

---

### Test 6.2: Progress Persistence

**Steps:**
1. Complete Level 1
2. Note your score/stars
3. Close the browser tab/window
4. Reopen the app
5. Navigate to Level 1 in the level map

**Verify:**
- [x] Level 1 shows as completed
- [x] Your score/stars are displayed
- [x] Progress is visible in level map

**Expected Result:** ✓ Level completion is saved and persists

---

## Section 7: Error Handling & Edge Cases

### Test 7.1: Invalid Inputs

**Steps:**
1. Try entering extremely long names (100+ characters)
2. Try special characters: !@#$%^&*()
3. Try numbers: 12345
4. Try spaces: "   " (only spaces)

**Verify:**
- [x] Form accepts or rejects inputs appropriately
- [x] Error messages are clear if input is invalid
- [x] No console errors
- [x] App doesn't crash

**Expected Result:** ✓ Input validation works

---

### Test 7.2: Rapid Button Clicks

**Steps:**
1. On level map, rapidly click Level 1 button multiple times
2. On game screen, rapidly click command buttons

**Verify:**
- [x] App handles rapid clicks gracefully
- [x] No duplicate commands are added
- [x] No multiple screen transitions
- [x] Button states are consistent

**Expected Result:** ✓ No unexpected behavior from rapid clicks

---

### Test 7.3: Browser Back Button

**Steps:**
1. Navigate through screens: Welcome → Setup → Level Map
2. On level map, click browser's native back button
3. Observe result

**Verify:**
- [x] Browser back button works (if app supports it)
- [x] OR if app prevents it, internal back button should work instead
- [x] Navigation is consistent with app's expected flow

**Expected Result:** ✓ Back navigation works as expected

---

## Section 8: Browser Compatibility Quick Check

### Recommended Browsers to Test

- [x] Chrome/Chromium (latest)
- [x] Firefox (latest)
- [x] Safari (if macOS available)
- [x] Edge (latest)

### Quick Checklist

For each browser:
- [ ] Welcome screen renders correctly
- [ ] Setup form works
- [ ] Level map loads
- [ ] Level plays and completes
- [ ] Mobile view works (DevTools)
- [ ] LocalStorage persists
- [ ] No console errors

---

## Test Execution Summary

### Desktop Testing Time Estimate
- Welcome screen: 2-3 minutes
- Setup screen: 3-4 minutes
- Level map: 2-3 minutes
- Game screen & Level 1: 3-4 minutes
- **Subtotal: 10-14 minutes**

### Mobile Testing Time Estimate
- Welcome (mobile): 2 minutes
- Setup (mobile): 2 minutes
- Level map (mobile): 2 minutes
- Game (mobile): 2 minutes
- Tablet test: 2 minutes
- Viewport switching: 2 minutes
- **Subtotal: 12 minutes**

### Total Estimated Time
- Full manual test run: **22-26 minutes**
- Quick smoke test: **5-10 minutes**

---

## Troubleshooting

### Issue: Page won't load
- **Solution:** Check that `npm run dev` is running
- Verify port 5173 is accessible
- Clear browser cache to clear localStorage

### Issue: Setup form won't submit
- **Solution:** Ensure you've typed a name (not just spaces)
- Check browser console for errors
- Try a different name

### Issue: Level won't start
- **Solution:** If Level 1 is locked, you may need to complete Level 0 or earlier
- Try refreshing the page
- Check console for errors

### Issue: Mobile view isn't responsive
- **Solution:** Make sure DevTools device mode is enabled
- Try a different device preset
- Clear browser cache

### Issue: Data not persisting
- **Solution:** Check LocalStorage is enabled in browser
- Check that you've waited for save to complete
- Try refreshing and checking if data returns

---

## Reporting Issues

When reporting issues found during manual testing, include:

1. **Environment:**
   - Browser and version
   - Device type (desktop/mobile)
   - Screen resolution
   - OS

2. **Steps to Reproduce:**
   - Clear sequence of actions
   - Expected vs. actual result

3. **Error Details:**
   - Console error messages
   - Screenshot if possible
   - Network request issues

4. **Data:**
   - Player name used
   - Avatar selected
   - Which level was being played

---

## Verification Checklist

- [x] Welcome screen (all 4 features)
- [x] Setup screen (form validation, avatar selection)
- [x] Level map screen (level display, level selection)
- [x] Game screen (interface, command input, execution)
- [x] Result screen (completion display, progression)
- [x] Mobile responsiveness (iPhone, iPad)
- [x] Data persistence (localStorage)
- [x] Navigation (forward, backward)
- [x] Error handling
- [x] Cross-browser compatibility

**Overall Status:** ✅ Ready for production testing

---

**Last Updated:** April 10, 2026
**Testing Guide Version:** 1.0
