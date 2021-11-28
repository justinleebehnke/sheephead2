Feature: "Blind Stealing"

Scenario: Users are Offered the option to Steal
  Given A new hand has been dealt

  When the first player has been offered the chance to pick or pass

  Then the other 3 players should see a button on the bottom right hand side of the screen labeled "Steal Blind"
   And the first player being offered should NOT have that button available

Scenario: Users lose the option to steal once offered the chance to pick or pass
  Given A new hand has been dealt
    And the first player to be offered to pick is deciding whether to pick or pass
    And the next player currently has the button to steal blind visible

   When the first player passes

   Then the button to steal should no longer be visible for the next player
    And the first player should never have seen the button

Scenario: If a player has intended to steal but then decides to pass it is fine
  Given A player has clicked the Steal Blind button

   When the player before them passes

   Then the player should be offered the chance to pass

Scenario: If two players click it, then it's the most recent still eligible to steal player
  Given A player (A) has clicked the Steal Blind button
    And another player (B) has clicked the Steal Blind button after A
    And another player (C) has clicked the Steal Blind button after B
    And the first player after the dealer decided to pass 

   When the player A picks and buries

   Then player B will be given the blind and player C will not be impacted


# Some thing interesting about this is that we have to make sure that it all gets settled properly

# We have to make sure that there is nothing left over once everyone has finished stealing

# So now we need to figure 

# How does this work... ? What entities are involved, who keeps track of whether there are blind stealers that want to get the chance to steal?
# Is it the player? No because we need someone to know who was first..
# But the player is involved because we need to be able to mark them as the stealer