# Define global variables.
g = {}

# Define global variables for the Trade Event.
g["trade"] = {}

# Import functions from modules.
from static.py.Monopoly.Bot import roll_dice
from static.py.Monopoly.Bot import Bot
from static.py.Monopoly import Players
import traceback
import datetime
import copy
import json

def process_trade_transaction(self, transaction):

    # Extract details from the transaction.
    details = transaction["details"]

    # Extract global variables from details.
    g["trade"]["mode"] = details["mode"]
    g["trade"]["in"] = details["in"]
    g["trade"]["player"] = details["player"]
    g["trade"]["other_player"] = details["other_player"]
    g["trade"]["money"] = details["money"]
    g["trade"]["property"] = details["property"]

    # Determine if an offer was received.
    if g["trade"]["mode"] == "offer":

        process_trade_transaction_offer(self)

    elif g["trade"]["mode"] == "counter":

        process_trade_transaction_offer(self)

    elif g["trade"]["mode"] == "reject":

        process_trade_transaction_reject(self)

    elif g["trade"]["mode"] == "accept":

        process_trade_transaction_accept(self)

    else:
        print("\nError: Trade.py: process_trade_transaction")
        print("Invalid mode: " + g["trade"]["mode"])

def process_trade_transaction_offer(self):

    import json

    # Get the current state of players in the trade event.
    player = self.players.players[g["trade"]["player"]["key"]]
    other_player = self.players.players[g["trade"]["other_player"]["key"]]
    

    # Get the value of the Player side of the Trade Event.
    # player = g["trade"]["player"]
    player_money_value = int(g["trade"]["money"]["player"])
    player_property_value = 0
    player_total_value = 0
    player_properties = g["trade"]["property"]["player"]

    try:
        # Get every Property offered by the originating Player.
        for property in player_properties.values():

            # Bypass placeholders in the Trade Event.
            if property == None:
                continue

            # Determine if the property is mortgaged.
            if property["mortgaged"] == True:

                # Consider mortgaged properties at half price.
                player_property_value += int(property["price"] / 2)

            else:

                # Accumulate the price of all Properties as Property value.
                player_property_value += int(property["price"])

    except Exception as e:
        print("\nError: Trade.py: process_trade_tranaction_offer")
        print("Exception: " + str(e))
        print("Global Variables: ")
        print(json.dumps(g, indent=4))
        raise Exception(str(e))



    # The total value offered by the originating Player is money plus Property value.
    player_total_value = player_money_value + player_property_value

    # Get the value of the Other Player side of the Trade Event.
    # other_player = g["trade"]["other_player"]
    other_player_money_value = int(g["trade"]["money"]["other_player"])
    other_player_property_value = 0
    other_player_total_value = 0
    other_player_properties = g["trade"]["property"]["other_player"]

    try:
        # Get every Property offered by the Other Player
        for property in other_player_properties.values():

            # Bypass placeholders in the Trade Event.
            if property == None:
                continue

            # Determine if the property is mortgaged.
            if property["mortgaged"] == True:

                # Consider mortgaged properties at half price.
                other_player_property_value += int(property["price"] / 2)

            else:

                # Accumulate the price of all Properties as Property value.
                other_player_property_value += int(property["price"])

    except Exception as e:
        print("\nError: Trade.py: process_trade_tranaction_offer")
        import json
        print("str(type(other_player_properties): " + str(type(other_player_properties))) 
        print("other_player_properties: " + json.dumps(other_player_properties))

    # The total value offered by the Other Player is money plus Property value.
    other_player_total_value = other_player_money_value + other_player_property_value

    # Determine if the current Bot is the originating Player.
    if self.bot["key"] == player["key"]:

        # The key for the response transaction is the Other Player.
        key = other_player["key"]

        # Check if the originating player has insufficient cash.
        if player["balance"] < int(g["trade"]["money"]["player"]):

            submit_rejection(self, key)

        # If the offer by the Other Player exeeds a threshold, accept.
        elif other_player_total_value > player_total_value * 1.2:

            submit_acceptance(self, key)

        # if the offer by the Other Player fails a minimum threshold, reject.
        elif other_player_total_value < player_total_value * 0.8:

            submit_rejection(self, key)
            print("\nPlayer rejected because of value.")

        # Otherwise, counter the Other Player by increasing cash.
        else:

            # Determine if the player has cash in this trade event.
            if g["trade"]["money"]["player"] > 0:

                # Reduce the cash the player has in this trade event.
                g["trade"]["money"]["player"] = int(g["trade"]["money"]["player"] * 0.9)

            else:

                # Increase the cash the other player has in this trade event by a percentage plus 10.
                g["trade"]["money"]["other_player"] = 10 + int(other_player_money_value * 1.20)

            submit_counter(self, key)

    else:

        # The key for the response transaction is the originating Player.
        key = player["key"]

        # Check if the other player has insufficient cash.
        if other_player["balance"] < int(g["trade"]["money"]["other_player"]):

            submit_rejection(self, key)
            print("other_player rejected because of cash.")

        # If the offer by the originating Player exeeds a threshold, accept.
        elif player_total_value > other_player_total_value * 1.5:

            submit_acceptance(self, key)

        # if the offer by the originating Player fails a minimum threshold, reject.
        elif player_total_value < other_player_total_value * 0.8:

            submit_rejection(self, key)
            print("\nOther player rejected because of value.")

        else:

            # Determine if the other player has cash in this trade event.
            if int(g["trade"]["money"]["other_player"]) > 0:

                # Decrease the cash the other player has in this trade event.
                try:
                    g["trade"]["money"]["other_player"] = int(g["trade"]["money"]["other_player"] * 0.9)
                except Exception as e:
                    print("\n**********")
                    print("Error: Trade.py: process_trade_transaction_offer")
                    print("Exception: " + str(e))
                    traceback.print_exc(g["trade"]["money"]["other_player"], g["trade"]["money"]["other_player"])
                    raise Exception(str(e))

            else:

                # Increase the cash the player has in this trade event by a percentage plus 10.
                g["trade"]["money"]["player"] = 10 + int(player_money_value * 1.20)

            submit_counter(self, key)

def submit_acceptance(self, key):

    print("\n{} submitted acceptance to {}.".format(self.bot["name"], self.players.players[key]["name"]))

    # Get references to the originating Player.
    player = self.players.players[g["trade"]["player"]["key"]]
    player_key = player["key"]
    player_money = int(g["trade"]["money"]["player"])
    player_properties = g["trade"]["property"]["player"]

    # Get references to the Other Player.
    other_player = self.players.players[g["trade"]["other_player"]["key"]]
    other_player_key = other_player["key"]
    other_player_money = int(g["trade"]["money"]["other_player"])
    other_player_properties = g["trade"]["property"]["other_player"]
    
    # Determine if the Player offered any money.
    if player_money > 0:

        # The balance of the originating player is reduce by the amount offered by the originating player.
        # Notify other players in the change of balance.
        roll_dice.subtract_bot_balance(self, player, player_money)

        # The balance of the other player is increased by the amount offered by the originating player.
        # Notify other players in the change of balance.
        roll_dice.add_bot_balance(self, other_player, player_money)

    # Determine if the Other Player offered any money.
    if other_player_money > 0:

        # Reduce the balance of the other player by the amount offered by the other player.
        # Notify other players in the change of balance.
        roll_dice.subtract_bot_balance(self, other_player, other_player_money)

        # Increase the balance of the originating player by the amount offered by the other player.
        # Notify other players in the change of balance.
        roll_dice.add_bot_balance(self, player, other_player_money)

    # Determine if the Player offered any Properties.
    for property in player_properties.values():

        # Determine if a property was traded.
        if property != None:

            # Remove the property key from the property keys of the originating player.
            roll_dice.remove_bot_property(self, player, property)

            # Append the property key to the property keys of the other player.
            roll_dice.append_bot_property(self, other_player, property)

            # Notify all players of the change in ownership.
            for player_key in self.players.players:

                # Define a transaction for a Player
                transaction = {}

                # Add timestamp used for sorting.
                transaction["timestamp"] = datetime.datetime.now().isoformat()

                # Set the action attribute of the transaction.
                transaction["action"] = "Update Property"

                # Define details for the transaction.
                details = {}
                details["target_player_key"] = other_player["key"]
                details["property_key"] = property["key"]

                # Add the details to the transaction.
                transaction["details"] = details

                # Add the transaction to the queue of a Player.
                self.players.player_queue[player_key].append(copy.deepcopy(transaction))

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
                details["property"] = json.dumps(self.properties.properties[property["key"]])

                # Add the details to the transaction.
                transaction["details"] = details

                # Add the transaction to the queue of a Player.
                self.players.player_queue[player_key].append(copy.deepcopy(transaction))

    # Determine if the Other Plyer offered any Properties.
    for property in other_player_properties.values():

        # Determine if a property was traded.
        if property != None:

            # Remove the property key from the property_keys of the other player
            roll_dice.remove_bot_property(self, other_player, property)

            # Append the property key to the property_keys of the player.
            roll_dice.append_bot_property(self, player, property)

            # Notify all players of the change in ownership.
            for player_key in self.players.players:

                # Define a transaction for a Player
                transaction = {}

                # Add timestamp used for sorting.
                transaction["timestamp"] = datetime.datetime.now().isoformat()

                # Set the action attribute of the transaction.
                transaction["action"] = "Update Property"

                # Define details for the transaction.
                details = {}
                details["target_player_key"] = player["key"]
                details["property_key"] = property["key"]

                # Add the details to the transaction.
                transaction["details"] = details

                # Add the transaction to the queue of a Player.
                self.players.player_queue[player_key].append(transaction)

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
                details["property"] = json.dumps(self.properties.properties[property["key"]])

                # Add the details to the transaction.
                transaction["details"] = details

                # Add the transaction to the queue of a Player.
                self.players.player_queue[player_key].append(copy.deepcopy(transaction))

    # Bot exits the Trade Event.
    g["trade"]["in"] = False

    # Define acceptance transaction.
    transaction = {}

    # Add timestamp to the transaction for sorting.
    transaction["timestamp"] = datetime.datetime.now().isoformat()

    # Add the trade action to the acceptance transaction.
    transaction["action"] = "Trade"

    # Define the details for the acceptance transaction.
    details = {}

    # Populate the details with the acceptance parameters.
    details["mode"] = "accept"
    details["in"] = g["trade"]["in"]
    details["player"] = g["trade"]["player"]
    details["other_player"] = g["trade"]["other_player"]
    details["money"] = g["trade"]["money"]
    details["property"] = g["trade"]["property"]

    # Add the details to the transaction.
    transaction["details"] = details

    # Add the transaction to the queue of the offering Player.
    self.players.player_queue[key].append(copy.deepcopy(transaction))

    # Determine if the bot started the Trade Event.
    if self.bot["key"] == g["trade"]["player"]:

        # Pass control to the next player.
        Bot.Bot.process_end_turn(self)

def submit_rejection(self, key):

    # Define rejection transaction.
    transaction = {}

    # Add timestamp to the transaction for sorting.
    transaction["timestamp"] = datetime.datetime.now().isoformat()

    # Add the reject action to the rejection transaction.
    transaction["action"] = "Trade"

    # Define the details for the rejection transaction.
    details = {}

    # Populate the details with the rejection parameters.
    details["mode"] = "reject"
    details["in"] = g["trade"]["in"]
    details["player"] = g["trade"]["player"]
    details["other_player"] = g["trade"]["other_player"]
    details["money"] = g["trade"]["money"]
    details["property"] = g["trade"]["property"]

    # Add the details to the transaction.
    transaction["details"] = details

    # Send the rejection transaction to the offering Player.
    self.players.player_queue[key].append(copy.deepcopy(transaction))

    # The Bot exits the Trade Event.
    g["trade"]["in"] = False

    print("\n{} submitted a rejection to {}.".format(self.bot["name"], self.players.players[key]["name"]))

def submit_counter(self, key):

    # Define counter transaction.
    transaction = {}

    # Add timestamp to the transaction for sorting.
    transaction["timestamp"] = datetime.datetime.now().isoformat()

    # Add the trade action to the counter transaction.
    transaction["action"] = "Trade"

    # Define the details for the counter transaction.
    details = {}

    # Populate the details with the counter parameters.
    details["mode"] = "counter"
    details["in"] = g["trade"]["in"]
    details["player"] = g["trade"]["player"]
    details["other_player"] = g["trade"]["other_player"]
    details["money"] = g["trade"]["money"]
    details["property"] = g["trade"]["property"]

    # Add the details to the transaction.
    transaction["details"] = details

    # Send the counter transaction to the offering Player.
    self.players.player_queue[key].append(copy.deepcopy(transaction))

    print("\n{} submitted a counter offer to {}.".format(self.bot["name"], self.players.players[key]["name"]))

def process_trade_transaction_reject(self):

    # Bot exits the Trade Event.
    g["trade"]["in"] = False

    print("\n{} had their offer or counter offer rejectd.".format(self.bot["name"]))

    # Pass control to the next player or bot when this bot is bankrupt.
    Bot.Bot.process_end_turn(self)

def process_trade_transaction_accept(self):

    # Bot exits the Trade Event.
    g["trade"]["in"] = False

    print("{} had their offer or counter offer accepted.".format(self.bot["name"]))

    # Pass control to the next player or bot when this bot is bankrupt.
    Bot.Bot.process_end_turn(self)

