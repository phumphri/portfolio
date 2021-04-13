from static.py.Monopoly import utilities as u
import datetime
import copy
import json


class Community_Chest:
    def __init__(self):

        # Define a container for the Cards.
        self["cards"] = {}

        # Add community chest cards.
        self["cards"]["GO"] = "Advance to GO. Collect $200."
        self["cards"]["BR"] = "Bank error in your favor. Collect $200."
        self["cards"]["DF"] = "Doctor's fee. Pay $50."
        self["cards"]["SS"] = "From sale of stock you get $50."
        self["cards"]["OJ"] = "Get Out of Jail Free."
        self["cards"]["TJ"] = "Go to Jail. Go directly to jail. Do not pass Go. Do not collect $200."
        self["cards"]["ON"] = "Grand Opera Night. Collect $50 from every player;for opening night seats."
        self["cards"]["XM"] = "Xmas Fund matures. Collect $100."
        self["cards"]["IT"] = "Income tax refund. Collect $20."
        self["cards"]["BD"] = "It is your birthday. Collect $10 from every player."
        self["cards"]["LI"] = "Life insurance matures. Collect $100."
        self["cards"]["HF"] = "Hospital Fees. Pay of $100."
        self["cards"]["SF"] = "Pay school fees $150."
        self["cards"]["RC"] = "Receive $25 consultancy fee."
        self["cards"]["SR"] = "You are assessed for street repairs. Pay $40 per house. Pay $115 per hotel you own."
        self["cards"]["BC"] = "You have won second prize;in a beauty contest. Collect $10."
        self["cards"]["IN"] = "You inherit $100."

        # Get the list of keys for the Community Chest Cards.
        self.keys = list(self["cards"].keys())

        # Randomly order the keys for the Community Chest Cards.
        self.community_chest["keys"] = u.shuffle_list(self.keys)

        # Set the maximum and current indexes of the Community Chest Cards.
        self.community_chest["maximum_index"] = len(self["cards"]) - 1
        self.community_chest["current_index"] = 0

    def process_community_chest_event(self, monopoly):

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
        print("\n********** Community Chest for {} **********".format(player["name"]))
        chance_lines = message.split(";", 4)
        for chance_line in chance_lines:
            print(chance_line)

        # Initialize player variables.
        self.payment = 0
        self.collection = 0
        self.property = None

        # Format the function name.
        command_string = "self.community_chest_{}()".format(self.key)

        print("Command String: " + command_string)
        print("************************************************")

        # Intialize the output and evaluate the function.
        self.payment = 0
        self.collection = 0
        eval(command_string)

        # Determine if a payment needs to be made.
        if self.payment > 0:

            # Preserve the current balance for logging.
            previous_balance = copy.copy(self.player["balance"])

            # Determine if the player has sufficient funds to make the payment.
            if self.payment > self.player["balance"]:

                # The player sells hotels until there are sufficient funds or no more hotels to sell.
                self.monopoly.sell_houses_or_hotels()

            # Determine if the player has sufficient funds to make the payment.
            if self.payment > self.player["balance"]:

                # Player mortgage properties until there are sufficient funds or no properties to mortgage.
                self.monopoly.mortgage_properties()

            # Determine if the player has sufficient funds to make the payment.
            if self.payment > self.player["balance"]: 
                self.monopoly.set_player_bankrupt()
                return

            # Subtract the amount from the balance of the bot.
            self.player["balance"] -= self.payment


            # Balance can never be negative.  Program logic error upstream.  False turns off code.
            if self.player["balance"] < 0 and True:

                # Log the action.
                print("\n{} had a negative balance. Logic error. Stopping all players and bots.".format(self.player["name"]))

                self.monopoly.set_error_encountered()

            print("\n{} had their balance decreased by {:n} from {:n} to {:n}.".format(self.player["name"], self.payment, previous_balance, self.player["balance"]))

        # Determine if a collection needs to be made.
        if self.collection > 0:

            # Store the previous value for the purpose of reporting.
            previous_balance = copy.copy(self.player["balance"])

            # Add the collection to the balance of the player.
            self.player["balance"] += self.collection

            print("\n{} had their balance increased by {:n} from {:n} to {:n}.".format(self.player["name"], self.collection, previous_balance, self.player["balance"]))

        # Refresh the balance of the player on the boards of all players by additing a transaction to the queue of each player.
        self.monopoly.update_player_balance()










    
    # self["cards"]["GO"] = "Advance to GO.  Collect $200."
    def community_chest_GO(self):

        # Get the start name for logging.
        start_name = self.properties[self.player["sequence"]]["name"]

        # Update the player with the new sequence.
        self.player["sequence"] = 0

        # Move the player on the boards of all players.
        self.monopoly.move_player_multiple_times()

        # Get the end name for logging.
        end_name = self.properties[self.player["sequence"]]["name"]

        print("\n{} moved from {} to {}.".format(self.player["name"], start_name, end_name))

    # self["cards"]["BR"] = "Bank error in your favor. Collect $200."
    def community_chest_BR(self):

        # Set the amount to be collected.
        self.collection = 200

    # self["cards"]["DF"] = "Doctor's fee. Pay $50."
    def community_chest_DF(self):

        # Set the amount to be paid.
        self.payment = 50

    # self["cards"]["SS"] = "From sale of stock you get $50."
    def community_chest_SS(self):

        # Set the amount to be collected.
        self.collection = 50

    # self["cards"]["OJ"] = "Get Out of Jail Free."
    def community_chest_OJ(self):

        # Increment the number of get out of jail cards.
        self.player["cards"] += 1

        print("\n{} had the number of cards increased to {:n}.".format(self.player["name"], self.player["cards"]))

    # self["cards"]["TJ"] = "Go to Jail. Go directly to jail. Do not pass Go. Do not collect $200."
    def community_chest_TJ(self):

        # Get start and end names
        start_name = self.properties[self.player["sequence"]]["name"]

        # Update the player with the new sequence.
        self.player["sequence"] = 30

        # Move the player on the boards of all players.
        self.monopoly.move_player_multiple_times()

        # Get the end name for logging
        end_name = "Jail"

        print("\n{} moved from {} to {}.".format(player["name"], start_name, end_name))

    # self["cards"]["ON"] = "Grand Opera Night. Collect $50 from every player for opening night seats."
    def community_chest_ON(self):

        # Loop through all playyers
        for temp_player in self.players.values():

            # Bypass the current player.
            if temp_player["key"] == self.player["key"]:
                continue

            # Bypass the bankrupt other players.
            if temp_player["bankrupt"] == True:
                continue

            # Increase the player's collection by 50.
            self.collection += 50

            # Decrease the other player's balance by 50.
            temp_player["balance"] -= 50

    # self["cards"]["XM"] = "Xmas Fund matures. Collect $100."
    def community_chest_XM(self):

        # Set the amount to be collected.
        self.collection = 100

    # self["cards"]["IT"] = "Income tax refund. Collect $20."
    def community_chest_IT(self):

        # Set the amount to be collected.
        self.collection = 20

    # self["cards"]["BD"] = "It is  your birthday. Collect $10 from every player."
    def community_chest_BD(self):

        # Loop through all players
        for temp_player in self.players.values():

            # Bypass the current Player.
            if temp_player["key"] == self.player["key"]:
                continue

            # Bypass the bakrupt Player.
            if temp_player["bankrupt"] == True:
                continue

            # Decrease the balance of the other player.
            temp_player["balance"] -= 10

            # Add to the collection for the player.
            self.collection += 10

    # self["cards"]["LI"] = "Life insurance matures – Collect $100."
    def community_chest_LI(self):

        # Set the amount to be collected.
        self.collection = 100

    # self["cards"]["HF"] = "Hospital Fees. Pay of $100."
    def community_chest_HF(self):

        # Set the amount to be paid.
        self.payment = 100

    # self["cards"]["SF"] = "Pay school fees $150."
    def community_chest_SF(self):

        # Set the amount to be paid.
        self.payment = 150

    # self["cards"]["RC"] = "Receive $25 consultancy fee."
    def community_chest_RC(self):

        # Set the amount to be collected.
        self.collection = 25

    # self["cards"]["SR"] = "You are assessed for street repairs: Pay $40 per house and $115 per hotel you own."
    def community_chest_SR(self):

        for temp_property in self.properties.values():

            if "hotels" in temp_property.keys():

                if temp_property["hotels"] > 0:

                    self.payment += 115

                    continue

            if "houses" in temp_property.keys():

                if temp_property["houses"] > 0:

                    self.payment += temp_property["houses"] * 40

                    continue

    # self["cards"]["BC"] = "You have won second prize in a beauty contest. Collect $10."
    def community_chest_BC(self):

        # Set the amount to be collected.
        self.collection = 10

    # self["cards"]["IN"] = "You inherit $100."
    def community_chest_IN(self):

        # Set the amount to be collected.
        self.collection = 100
