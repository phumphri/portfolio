from static.py.Monopoly import utilities as u
import datetime
import copy
import json


class Chance:

    def __init__(self):

        # Define a container for the Cards.
        self.cards = {}

        # Add chance cards.
        self.cards["GO"] = "Advance to GO.;Collect $200. "
        self.cards["IL"] = "Advance to Illinois Avenue. If you pass GO, collect $200. "
        self.cards["SC"] = "Advance to St. Charles Place. If you pass GO, collect $200. "
        self.cards["NU"] = "Advance to the nearest Utility. "
        self.cards["NR"] = "Advance to the nearest Railroad. "
        self.cards["BD"] = "Bank pays you a dividend of $50. "
        self.cards["OJ"] = "Get Out of Jail Free. "
        self.cards["BS"] = "Go back three spaces. "
        self.cards["TJ"] = "Go to Jail. Go directly to jail. Do not pass Go. Do not collect $200. "
        self.cards["GR"] = "You are to make repairs on;all your properties. Pay $25 per house.  Pay $100 per hotel you own. "
        self.cards["PT"] = "Pay Poor Tax of $15. "
        self.cards["RR"] = "Take a trip on the Reading Railroad. "
        self.cards["WB"] = "Take a walk on the Boardwalk. "
        self.cards["CB"] = "You have been elected;Chairman of the Board. Pay each player $50. "
        self.cards["BL"] = "Your building and loan matures. Collect $150. "

        # Get the list of keys for the chance cards.
        self.keys = list(self.cards.keys())

        # Randomly order the keys for the chance cards.
        self.keys = u.shuffle_list(self.keys)

        # Set the maximum and current indexes of the chance cards.
        self.maximum_index = len(self.keys) - 1
        self.current_index = 0

    def process_chance_event(self, monopoly):

        # Get a reference to the Monopoly instance.
        self.monopoly = monopoly

        # Get a reference to the games.
        self.games = monopoly.games

        # Get a reference to the game key.
        self.game_key = monopoly.game_key

        # Get a reference to the player key.
        self.player_key = monopoly.player_key

        # Get a reference to the game.
        self.game = self.monopoly.games[self.monopoly.game_key]

        # Get a reference to the players in the game.
        self.players = self.game["players"].players

        # Get a reference to the key of the player.
        self.player_key = monopoly.player_key

        # Get a reference to the player.
        self.player = self.players[self.player_key]

        # Get a reference to the properties in the game.
        self.properties = self.game["properties"].properties

        # Increment the index of the Chance cards.
        self.current_index += 1

        # If the index exceeds the maximum, reset the index to zero.
        if self.current_index > self.maximum_index:
            self.current_index = 0

        # Get the key corresponding to the current index.
        self.key = self.keys[self.current_index]

        # Get the message from the current card.
        message = self.cards[self.key]

        # Define a multiple-line message to be displayed on the Roll Dice Screen.
        for i in range(4):
            message = message.replace(". ", ".;")

        # Log the message.
        print("\n********** Chance Card for {} **********".format(player["name"]))
        chance_lines = message.split(";", 4)
        for chance_line in chance_lines:
            print(chance_line)

        # Initialize player variables.
        self.payment = 0
        self.collection = 0
        self.property = None

        # Format the function name.
        command_string = "self.chance_{}()".format(self.key)

        print("Command String: " + command_string)
        print("************************************************")

        # Intialize the output and evaluate the function.
        self.payment = 0
        self.collection = 0
        eval(command_string)

        # Determine if a payment needs to be made.
        if self.payment > 0:

            # Preserve the current balance for reporting.
            previous_balance = copy.copy(player["balance"])

            # Determine if the player has sufficient funds to make the payment.
            if self.payment > player["balance"]:

                # The player sells hotels until there are sufficient funds or no more hotels to sell.
                self.monopoly.sell_houses_or_hotels()

            # Determine if the player has sufficient funds to make the payment.
            if self.payment > player["balance"]:

                # Player mortgage properties until there are sufficient funds or no properties to mortgage.
                self.monopoly.mortgage_properties()

            # Determine if the player has sufficient funds to make the payment.
            if self.payment > player["balance"]: 
                self.monopoly.set_player_bankrupt()
                return

            # Subtract the amount from the balance of the bot.
            player["balance"] -= self.payment

            # Balance can never be negative.  Program logic error upstream.  False turns off code.
            if player["balance"] < 0 and True:

                # Log the action.
                print("\n{} had a negative balance. Logic error. Stopping all players and bots.".format(player["name"]))

                # Notify each player that an error was encountered and stop processing.
                transaction = {}

                # Set the action attribute of the transaction.
                transaction["action"] = "Error Encountered"

                # Define details for the transaction.
                details = {}

                # Add the details to the transaction.
                transaction["details"] = details

                for temp_player in self.players.values():

                    # Add the transaction to the queue of a player.
                    temp_player.append(copy.deepcopy(transaction))

            print("\n{} had their balance decreased by {:n} from {:n} to {:n}.".format(player["name"], self.payment, previous_balance, player["balance"]))

        # Determine if a collection needs to be made.
        if self.collection > 0:

            # Store the previous value for the purpose of reporting.
            previous_balance = copy.copy(player["balance"])

            # Add the collection to the balance of the player.
            player["balance"] += self.collection

            print("\n{} had their balance increased by {:n} from {:n} to {:n}.".format(player["name"], self.collection, previous_balance, player["balance"]))

        # Update the balance of the player on the boards of all other players.
        self.monopoly.update_player_balance()

    # self.cards["GO"] = "Advance to GO.  Collect $200."
    def chance_GO(self):

        # Get the start name for logging.
        start_name = self.properties[self.player["sequence"]]["name"]

        # Update the player with the new sequence.
        self.player["sequence"] = 0

        # Move the player on the boards of all players.
        self.monopoly.move_player_multiple_times()

        # Get the end name for logging.
        end_name = self.properties[self.player["sequence"]]["name"]

        print("\n{} moved from {} to {}.".format(self.player["name"], start_name, end_name))

    # self.cards["IL"] = "Advance to Illinois Avenue.  If you pass GO, collect $200."
    def chance_IL(self):

        # Get the start name for logging.
        start_name = self.properties[self.player["sequence"]]["name"]

        # Update the player with the new sequence.
        self.player["sequence"] = 24

        # Move the player on the boards of all players.
        self.monopoly.move_player_multiple_times()

        # Get the end name for logging.
        end_name = self.properties[self.player["sequence"]]["name"]

        print("\n{} moved from {} to {}.".format(self.player["name"], start_name, end_name))

    # self.cards["SC"] = "Advance to St. Charles Place.  If you pass GO, collect $200."
    def chance_SC(self):

        # Get the start name for logging.
        start_name = self.properties[self.player["sequence"]]["name"]

        # Update the player with the new sequence.
        self.player["sequence"] = 11

        # Move the player on the boards of all players.
        self.monopoly.move_player_multiple_times()

        # Get the end name for logging.
        end_name = self.properties[self.player["sequence"]]["name"]

        print("\n{} moved from {} to {}.".format(self.player["name"], start_name, end_name))

    # self.cards["NU"] = "Advance to the nearest Utility."
    def chance_NU(self):

        # Get the start name for logging.
        start_name = self.properties[self.player["sequence"]]["name"]

        # Determine if the player is before the Electric Company.
        if self.player["sequence"] < 12:

            # Update the player with the new sequence.
            self.player["sequence"] = 12

        # Determine if the player is before the Water Works.
        elif self.player["sequence"] < 28:

            # Update the player with the new sequence.
            self.player["sequence"] = 28

        # The player is past the Water Works.
        else:

            # Update the player with the new sequence.
            self.player["sequence"] = 12

        # Get the end name for logging.
        end_name = self.properties[self.player["sequence"]]["name"]

        # Move the player on the boards of all players.
        self.monopoly.move_player_multiple_times()

        print("\n{} moved from {} to {}.".format(self.player["name"], start_name, end_name))

    # self.cards["NR"] = "Advance to the nearest Railroad."
    def chance_NR(self):

        # Get the start name for logging.
        start_name = self.properties[self.player["sequence"]]["name"]

        # Determine if the player is before the Reading Railroad.
        if self.player["sequence"] < 5:

            # Update the player with the new sequence.
            self.player["sequence"] = 5

        # Determine if the player is before the Pennsylvania Railroad.
        elif self.player["sequence"] < 15:

            # Update the player with the new sequence.
            self.player["sequence"] = 15

        # Determine if the player is before the B & O Railroad.
        elif self.player["sequence"] < 25:

            # Update the player with the new sequence.
            self.player["sequence"] = 25

        # Determine if the player is before the Short Line Railroad.
        elif self.player["sequence"] < 35:

            # Update the player with the new sequence.
            self.player["sequence"] = 35

        # The player is past the Short Line Railroad.
        else:

            # Update the player with the new sequence.
            self.player["sequence"] = 5

        # Get the end name for logging.
        end_name = self.properties[self.player["sequence"]]["name"]

        # Move the player on the boards of all players.
        self.monopoly.move_player_multiple_times()

        print("\n{} moved from {} to {}.".format(self.player["name"], start_name, end_name))

    # self.cards["BD"] = "Bank pays you a dividend of $50."
    def chance_BD(self):

        # Set the amount to be collected.
        self.collection = 50

    # self.cards["OJ"] = "Get Out of Jail Free."
    def chance_OJ(self):

        # Increment the number of get-out-of-jail cards.
        self.player["cards"] += 1

        print("\n{} had their number of get-out-of-jail cards increased to {:n}.".format(self.player["name"], self.player["cards"]))

    # self.cards["BS"] = "Go back three spaces."
    def chance_BS(self):

        # Get start name for logging.
        start_name = self.properties[self.player["sequence"]]["name"]

        # Back up three spaces.
        self.player["sequence"] -= 3

        # Determine if the player backed around Go.
        if self.player["sequence"] < 0:

            # Normalize the sequence of the player.
            self.player["sequence"] += 40

        # Get the end name for logging.
        end_name = self.properties[self.player["sequence"]]["name"]

        # Move the player on the boards of all players.
        self.monopoly.move_player_multiple_times()

        print("\n{} moved from {} to {}.".format(self.player["name"], start_name, end_name))

    # self.cards["TJ"] = "Go to Jail. Go directly to jail. Do not pass Go. Do not collect $200."
    def chance_TJ(self):

        # Get start and end names
        start_name = self.properties[self.player["sequence"]]["name"]

        # Update the player with the new sequence.
        self.player["sequence"] = 30

        # Move the player on the boards of all players.
        self.monopoly.move_player_multiple_times()

        # Get the end name for logging
        end_name = "Jail"

        print("\n{} moved from {} to {}.".format(player["name"], start_name, end_name))

    # self.cards["GR"] = "You are to make repairs on all your properties. Pay $25 per house and $100 per hotel you own."
    def chance_GR(self):

        # Loop through the properties owned by the player.
        for property_key in self.player["property_keys"]:

            # Get the reference to the next property.
            property = self.properties[property_key]

            # Determine if the property can have hotels.
            if "hotels" in property.keys():

                # Determine if the property has a hotel.
                if property["hotels"] > 0:

                    # Pay for the hotel.
                    self.payment += 100

                    # Get the next property.
                    continue

            # Determine if the property can have houses.
            if "houses" in property.keys():

                # Determine if the property has houses.
                if property["houses"] > 0:

                    # Pay for the houses.
                    self.payment += property["houses"] * 25

                    # Get the next property.
                    continue

    # self.cards["PT"] = "Pay Poor Tax of $15."
    def chance_PT(self):

        # Set the amount to be paid.
        self.payment = 15

    # self.cards["RR"] = "Take a trip on the Reading Railroad."
    def chance_RR(self):

        # Get start name for logging.
        start_name = self.properties[self.player["sequence"]]["name"]

        # Update the player with the new sequence.
        self.player["sequence"] = 5

        # Move the player on the boards of all players.
        self.monopoly.move_player_multiple_times()

        # Get the end name for logging.
        end_name = self.properties[self.player["sequence"]]["name"]

        print("\n{} moved from {} to {}.".format(self.player["name"], start_name, end_name))

    # self.cards["WB"] = "Take a walk on the Boardwalk."
    def chance_WB(self):

        # Get the start name for logging.
        start_name = self.properties[self.player["sequence"]]["name"]

        # Update the player with the new sequence which puts it on Boardwalk.
        self.player["sequence"] = 39

        # Move the player on the boards of all players.
        self.monopoly.move_player_multiple_times()

        # Get the end name for logging.
        end_name = self.properties[self.player["sequence"]]["name"]

        print("\n{} moved from {} to {}.".format(self.player["name"], start_name, end_name))

    # self.cards["CB"] = "You have been elected Chairman of the Board.  Pay each player $50."
    def chance_CB(self):

        # Loop through all players.
        for temp_player in self.players.values():

            # Bypass the current player.
            if temp_player["key"] == self.player_key:
                continue

            # Bypass the bankrupt other players.
            if temp_player["bankrupt"] == True:
                continue

            # Decrease the player's payment by 50.
            self.payment -= 50

            # Increase the other player's balance by 50.
            temp_player["balance"] += 50

    # self.cards["BL"] = "Your building and loan matures.  Collect $150."
    def chance_BL(self):

        # Set the amount to be collected.
        self.collection = 150


