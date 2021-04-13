
# Define global variables.
import traceback
import json
import copy
import datetime
from static.py.Monopoly.Bot import roll_dice
g = {}

# Define global variables for the Auction Event.
g["auction"] = {}

# Import functions from the Bot module.


def process_auction_transaction(self, transaction):

    # Verify paramenter "transaction" was defined.
    if str(type(transaction)) == "undefined":
        print("\nError: process_auction_transaction.js: process_auction_transaction")
        print('Parameter "transaction" was undefined.')
        traceback.print_exc(); set_error_encountered()
        return

    # Verify parameter "transaction" was not null.
    if transaction == None:
        print("\nError: process_auction_transaction.js: process_auction_transaction")
        print('Parameter "transaction" was null.')
        traceback.print_exc(); set_error_encountered()
        return

    # Make transaction parameters globally available.
    try:
        details = transaction["details"]
        g["auction"]["in"] = details["in"]
        g["auction"]["starter_key"] = details["starter_key"]
        g["auction"]["doubles_were_rolled"] = details["doubles_were_rolled"]
        g["auction"]["property"] = details["property"]
        g["auction"]["bids"] = details["bids"]
        g["auction"]["highest_bidder_key"] = details["highest_bidder_key"]
        g["auction"]["highest_bid"] = details["highest_bid"]
        # g["auction"]["number_of_folds"] = details["number_of_folds"]

    except Exception as e:
        print("\nAuction.py: process_auction_transaction")
        print("Exception: " + str(e))
        print("details: " + json.dumps(details))

    # Determine if the auction has finished.
    if g["auction"]["in"] == False:

        print("\n{}  was notified that the auction is no longer active.".format(
            self.bot["name"]))

        # The auction is finished for this bot.
        end_auction_for_this_bot(self)
        return

    print("\n{} processing auction for {}.".format(
        self.bot["name"], g["auction"]["property"]["name"]))

    # Determine if the Player is bankrupt.
    if self.bot["bankrupt"] == True:

        # The bankrupt Player folds.
        g["auction"]["bids"][self.bot["key"]] = "Fold"

        print("\n{} folded becuase it was bankrupt.".format(self.bot["name"]))

    # Define a counter for the number of folds.
    g["auction"]["number_of_folds"] = 0

    # Count the number of folds.
    for player_key in g["auction"]["bids"]:

        # Get a reference to the bid of a player.
        bid = g["auction"]["bids"][player_key]

        # Do not calculate highest bid if a player has folded.
        if (bid == "Fold"):

            # Increment the number of folds.
            g["auction"]["number_of_folds"] += 1

        else:

            # Convert the bid to type integer.
            bid = int(bid)

            # Determine if the bid of a player is the highest bid.
            if bid > g["auction"]["highest_bid"]:

                # Update the Auction Event with the highest bid and highest bidder.
                g["auction"]["highest_bid"] = bid
                g["auction"]["highest_bidder_key"] = player_key

    print("\n{} has counted {:n} folds in this auction.".format(
        self.bot["name"], g["auction"]["number_of_folds"]))

    # At least three of the four players have folded.
    if g["auction"]["number_of_folds"] > 2:

        # Assign the property to the highest bidder and issue an end-auction transaction to all players.
        assign_property_to_highest_bidder(self)
        return

    # Determine if the current player has folded.
    if g["auction"]["bids"][self.bot["key"]] == "Fold":

        # Submit the folded bid and pass control to the next Player or Bot.
        submit_bid(self)
        return

    # Increment the highest bid by 10 and offer it to the current player.
    g["auction"]["bid_amount"] = g["auction"]["highest_bid"] + 10

    # This player continues to participate in the auction.
    continue_auction_for_this_player(self)


def continue_auction_for_this_player(self):

    bid_amount = g["auction"]["bid_amount"]

    balance = self.bot["balance"]

    # Determine the threshold.
    threshold = balance * 0.20

    # Determine if the bid amount is greater than the tollerance for this Bot.
    if bid_amount > threshold:

        # Folded when the tollerance is exceeded.
        g["auction"]["bids"][self.bot["key"]] = "Fold"

        print("\n{} folded becuase the bid of {:n} exceeded the threshold of {:n}.".format(
            self.bot["name"], bid_amount, threshold))

        # If folded makes 3 folded, assign the property.  TODO: Added 2021-03-07 11:46
        if g["auction"]["number_of_folds"] == 2:

            # Assign the property to the highest bidder and issue an end-auction transaction to all players.
            assign_property_to_highest_bidder(self)
            return

    else:

        g["auction"]["bids"][self.bot["key"]] = bid_amount

        print("\n{0}  made the bid of {1:.0f}, below the threshold of {2:.0f}.".format(
            self.bot["name"], bid_amount, threshold))

    # Submit the bid to the next Player or Bot.
    submit_bid(self)
    return


def assign_property_to_highest_bidder(self):

    # Get the key of the highest bidder.
    highest_bidder_key = g["auction"]["highest_bidder_key"]

    # If the key of the highest bidder is null, then assume the key of the player who started the Auction Event.
    if highest_bidder_key == None:
        highest_bidder_key = g["auction"]["starter_key"]

    # Get the name of the highest bidder.
    player_name = self.players.players[highest_bidder_key]["name"]

    print("\n{} won the auction for {}.".format(
        player_name, g["auction"]["property"]["name"]))

    # Assign an alias to the key of the highest bidder as the key of the winning player.
    winning_player_key = highest_bidder_key

    # Get a reference to the player who had the ighest bid.
    winning_player = self.players.players[winning_player_key]

    # Determine if the Player is not bankrupt.
    if winning_player["bankrupt"] == True:

        print("\nError:  The winning player {} was bankrupt.".format(
            winning_player["name"]))

    else:

        # Get the key of the auctioned property.
        property_key = g["auction"]["property"]["key"]

        # Update the owner of the auctioned property.
        self.properties.properties[property_key]["owner"] = winning_player_key

        # Add the auctioned property to the winning player.
        self.players.players[winning_player_key]["property_keys"].append(
            property_key)

        # Adjust the highest_bid to be no more than the balance of the winning player.
        if (g["auction"]["highest_bid"] > winning_player["balance"]):
            g["auction"]["highest_bid"] = winning_player["balance"]

        # Get the subtract_balance function from the roll_dice module.
        from static.py.Monopoly.Bot import roll_dice

        # Update the balance of the winning player and notify all other players.
        roll_dice.subtract_bot_balance(
            self, winning_player, g["auction"]["highest_bid"])

        # Notify all Players and Bots of the change in ownership.
        for player_key in self.players.players:

            # Define a transaction for a Player
            transaction = {}

            # Add timestamp used for sorting.
            transaction["timestamp"] = datetime.datetime.now().isoformat()

            # Set the action attribute of the transaction.
            transaction["action"] = "Update Property"

            # Define details for the transaction.
            details = {}
            details["target_player_key"] = winning_player_key
            details["property_key"] = property_key

            # Add the details to the transaction.
            transaction["details"] = details

            # Add the transaction to the queue of a Player.
            self.players.player_queue[player_key].append(
                copy.deepcopy(transaction))
            # Update the Property Icon Class for all players.  TODO:  Added 2020-03-007 09:20

        for player_key in self.players.players.keys():

            # Define a transaction for a Player
            transaction = {}

            # Add timestamp used for sorting.
            transaction["timestamp"] = datetime.datetime.now().isoformat()

            # Set the action attribute of the transaction.
            transaction["action"] = "Update Property Icon Class"

            # Define details for the transaction.
            details = {}
            details["property"] = json.dumps(
                self.properties.properties[property_key])

            # Add the details to the transaction.
            transaction["details"] = details

            # Add the transaction to the queue of a Player.
            self.players.player_queue[player_key].append(
                copy.deepcopy(transaction))

            # Log the winnning player.
            player_name = self.players.players[player_key]["name"]
            winning_player_name = self.players.players[winning_player_key]["name"]
            property_name = self.properties.properties[property_key]["name"]
            print("\n{} was notified that {} won the auction for {} and moved the property.".format(
                player_name, winning_player_name, property_name))

        # Put next player logic here.

    # Set the g["auction"]["in"] to False and pass the transaction to the next player.
    submit_end_auction_transactions(self)

def submit_end_auction_transactions(self):

    for player_key in self.players.players:

        # End the auction.
        g["auction"]["in"] = False

        # Create a transaction to pass the auction to the next player.
        transaction = {}

        # Add timestamp for sorting.
        transaction["timestamp"] = datetime.datetime.now().isoformat()

        # Add the action to the transaction.
        transaction["action"] = "Auction"

        # Create details containing the current bids.
        details = {}
        details["in"] = False
        details["starter_key"] = g["auction"]["starter_key"]
        details["doubles_were_rolled"] = g["auction"]["doubles_were_rolled"]
        details["property"] = g["auction"]["property"]
        details["highest_bidder_key"] = g["auction"]["highest_bidder_key"]
        details["highest_bid"] = g["auction"]["highest_bid"]
        details["bids"] = g["auction"]["bids"]

        # Add the details to the transaction.
        transaction["details"] = details

        # Add the transaction to the queue of a Player.
        self.players.player_queue[player_key].append(
            copy.deepcopy(transaction))

        player_name = self.players.players[player_key]["name"]
        property_key = g["auction"]["property"]["key"]
        property = self.properties.properties[property_key]
        property_name = property["name"]
        print("\n{} was notified that the auction for {} has ended.".format(
            player_name, property_name))

    # Determine if the player who started the auction had previous rolled doubles.
    if g["auction"]["doubles_were_rolled"] == True:

        # Since the player who started the auction had previously rolled doubles, they get to roll again.
        next_player_key = g["auction"]["starter_key"]

        g["auction"]["doubles_were_rolled"] = False

    else:

        # Pass control to the player after the player who started the auction.
        if g["auction"]["starter_key"] == "car":

            next_player_key = "top_hat"

        elif g["auction"]["starter_key"] == "top_hat":

            next_player_key = "shoe"

        elif g["auction"]["starter_key"] == "shoe":

            next_player_key = "dog"

        elif g["auction"]["starter_key"] == "dog":

            next_player_key = "car"

        else:
            print("\nError: Auction.py: submit_end_auction_transactions")
            print('Invalid g["auction"]["starter_key"]')
            print("g.auction: " + json.dumps(g["auction"]))

    # Create a transaction to have the player who started the auction event to roll dice.
    transaction = {}

    # Add timestamp for sorting.
    transaction["timestamp"] = datetime.datetime.now().isoformat()

    # Add the action to the transaction.
    transaction["action"] = "Roll Dice"

    # Create an empty details.
    details = {}

    details["text"] = "{} passed control to {}.".format(
        g["auction"]["starter_key"], next_player_key)

    # Add details to the transaction.
    transaction["details"] = details

    # Add the transaction to the queue of the player who started the auction.
    self.players.player_queue[next_player_key].append(transaction)

    player_name = self.players.players[g["auction"]["starter_key"]]["name"]

    next_player_name = self.players.players[next_player_key]["name"]

    print('\n{} submitted transaction "Roll Dice" to passed control to {}.'.format(
        player_name, next_player_name))


def end_auction_for_this_bot(self):

    print("\nAuction for {}  has ended.".format(self.bot["name"]))

    # Initialize Auction Event for this player.
    # Commented code because of overlapping auctions.  2021-03-12 08:36
    # g["auction"]["in"] = False
    # g["auction"]["starter_key"] = None
    # g["auction"]["doubles_were_rolled"] = False
    # g["auction"]["property"] = None
    # g["auction"]["bids"] = {}
    # for player_key in self.players.players.keys():
    #     g["auction"]["bids"][player_key] = 0
    # g["auction"]["highest_bid"] = 0
    # g["auction"]["highest_bidder_key"] = None
    # g["auction"]["number_of_folds"] = 0


def submit_bid(self):

    # Get the key of the current Bot.
    player = self.bot
    player_key = self.bot["key"]

    # Select the next Player or Bot.
    if player_key == "car":
        player_key = "top_hat"
        player = self.players.players[player_key]

    elif player_key == "top_hat":
        player_key = "shoe"
        player = self.players.players[player_key]

    elif player_key == "shoe":
        player_key = "dog"
        player = self.players.players[player_key]

    elif player_key == "dog":
        player_key = "car"
        player = self.players.players[player_key]

    # Bypass the select Player or Bot if they are bankrupt.
    if player_key == "car" and player["bankrupt"] == True:
        player_key = "top_hat"
        player = self.players.players[player_key]
        g["auction"]["bids"]["car"] = "Fold"

    if player_key == "top_hat" and player["bankrupt"] == True:
        player_key = "shoe"
        player = self.players.players[player_key]
        g["auction"]["bids"]["top_hat"] = "Fold"

    if player_key == "shoe" and player["bankrupt"] == True:
        player_key = "dog"
        player = self.players.players[player_key]
        g["auction"]["bids"]["shoe"] = "Fold"

    if player_key == "dog" and player["bankrupt"] == True:
        player_key = "car"
        player = self.players.players[player_key]
        g["auction"]["bids"]["dog"] = "Fold"

    # Create a transaction to pass the auction to the next player.
    transaction = {}

    # Add timestamp for sorting.
    transaction["timestamp"] = datetime.datetime.now().isoformat()

    # Add auction action to the transaction.
    transaction["action"] = "Auction"

    # Create details containing the current bids.
    details = {}
    details["in"] = g["auction"]["in"]
    details["starter_key"] = g["auction"]["starter_key"]
    details["doubles_were_rolled"] = g["auction"]["doubles_were_rolled"]
    details["property"] = g["auction"]["property"]
    details["highest_bid"] = g["auction"]["highest_bid"]
    if g["auction"]["highest_bidder_key"] == None:
        g["auction"]["highest_bidder_key"] = g["auction"]["starter_key"]
    details["highest_bidder_key"] = g["auction"]["highest_bidder_key"]
    details["bids"] = g["auction"]["bids"]
    details["number_of_folds"] = g["auction"]["number_of_folds"]

    # Add details to the transaction.
    transaction["details"] = details

    # Add the transaction to the queue of a Player.
    self.players.player_queue[player_key].append(transaction)

    print('\n{} submitted bid transaction "Auction" to {}.'.format(
        self.bot["name"], player["name"]))

# Alert all other Players that an error was encountered.


def set_error_encountered(self):

    # Send an error encountered transaction to all other players.
    for player_key in self.players.players:

        # Do not send a duplicate error encounted transaction to self.
        if player_key == self.bot["key"]:
            continue

        # Format error encountered transaction.
        transaction = {}

        # Add timestamp for sorting.
        transaction["timestamp"] = datetime.datetime.now().isoformat()

        # Set action of the transaction.
        transaction["action"] = "Error Encountered"

        # Format the details for the error encountered transaction.
        details = {}
        details["error_encountered"] = True

        # Add the details to the error encountered transaction.
        transaction["details"] = details

        # Append a transaction to the queue of a Player.
        self.players.player_queue[player_key].append(transaction)

    # Stop monitoring the queue for this Bot.
    self.monitor_queue = False
