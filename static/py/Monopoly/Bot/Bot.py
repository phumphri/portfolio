# Make compilation units available.
from static.py.Monopoly import Players
from static.py.Monopoly import Properties
from static.py.Monopoly import Community_Chest
from static.py.Monopoly import Chance
from static.py.Monopoly import utilities
from static.py.Monopoly.Bot import roll_dice
from static.py.Monopoly.Bot import Trade
from static.py.Monopoly.Bot import Auction
from time import sleep
import datetime
import copy
import json


class Bot:

    # This Bot is created by an instance of Monopoly.
    def __init__(self, players, properties, community_chest, chance):

        # Make references to the class instantiations.
        self.players = players
        self.properties = properties
        self.community_chest = community_chest
        self.chance = chance
        self.bot = None

        self.number_of_doubles = 0
        self.doubles_were_rolled = False
        self.in_jail = False
        self.number_of_rolls_in_jail = 0

        # This Bot is going to accept the first Player it finds that is not assigned.
        for player in self.players.players.values():

            # Determine if the next Player is assigned.
            if player["assigned"] == False:

                # Assign the Player to this Bot..
                self.bot = player

                # Set the status of the Player to that of being assigned.
                player["assigned"] = True

                # Finish when the first Player that is unassigned is found.
                break

        self.monitor_queue = True

    # Get the name of this bot.  Value None controls the automation process of assigning bots to boards.
    def get_name(self):

        if self.bot == None:
            return None
        else:
            return self.bot["name"]

    # Launched from Monopoly.py as a thread.
    def get_queue(self):

        while self.monitor_queue == True:

            # Check the queue once every two seconds.
            sleep(2)

            # Check if there are any transactions to process.
            if len(self.players.player_queue[self.bot["key"]]) == 0:
                continue

            # Get a copy of the transactions for this bot.
            transactions = copy.deepcopy(
                self.players.player_queue[self.bot["key"]])

            # Reset the queue for this bot.
            self.players.player_queue[self.bot["key"]].clear()

            # Process all transactions in the list of transactions.
            for transaction in transactions:

                # Extract the action from the transaction.
                action = transaction["action"]

                # Extract the details from the transaction.
                details = transaction["details"]

                # Determine if the action indicates an error was encountered.
                if action == "Error Encountered":

                    print('\n{} encountered the "Error Encountered" transaction.'.format(
                        self.bot["name"]))

                    # Stop monitoring the queue.
                    self.monitor_queue = False
                    print('\n{} stopped monitoring queue.'.format(
                        self.bot["name"]))

                    # Stop processing.
                    print('\n{} stopped processing.'.format(self.bot["name"]))
                    return

                # Determine if there is one winner.
                if action == "Winner":

                    # Stop monitoring the queue.
                    self.monitor_queue = False
                    break

                # Determine if the index of the Community Chest needs to be updated.
                if action == "Update Community Chest Index":

                    # Update the current index of Community Chest.
                    self.update_community_chest_index(details)

                    # Continue monitoring the queue.
                    continue

                # Determine if the index of Chance needs to be updated.
                if action == "Update Chance Index":

                    # Update the current index of Chance.
                    self.update_chance_index(details)

                    # Continue monitoring the queue.
                    continue

                # Determine if this is a trade transaction.
                if action == "Trade":

                    print("\n**********")
                    print("Bot Trade Transaction for {}.".format(self.bot["name"]))
                    print(json.dumps(transaction, indent=4))
                    print("**********")

                    # Process a trade transaction.
                    Trade.process_trade_transaction(self, transaction)

                    # Continue monitoring the queue.
                    continue

                # A Player pressed the Reset Button.
                if action == "Reset":

                    # Reset is done from a Player, not a bot.
                    self.monitor_queue = False
                    break

                # A Player has started an Auction Event.
                if action == "Auction":

                    # Process Auction Event.
                    Auction.process_auction_transaction(self, transaction)

                    continue

                # Roll dice.
                if (action == "Roll Dice"):

                    # Roll dice and process results.
                    roll_dice.roll_dice(self)

                    # Process the next transaction.
                    continue

        # Stop monitoring the queue.
        print("\n{} stopped monitoring the queue.".format(self.bot["name"]))

        return

    # Update the current index of Community Chest.
    def update_community_chest_index(self, details):

        # print("\n{}.update_community_chest_index(self, details).".format(self.bot["name"]))

        self.community_chest.community_chest["current_index"] = details["key"]

    # Update the current index of Chance.
    def update_chance_index(self, details):

        # print("\n{}.update_chance_index(self, details).".format(self.bot["name"]))

        self.chance.chance["current_index"] = details["key"]

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

    # Pass control to the next Player or Bot.
    def process_end_turn(self):

        # Define transaction
        transaction = {}

        # Add timestamp to the transaction for sorting.
        transaction["timestamp"] = datetime.datetime.now().isoformat()

        # Set action of the transaction.
        transaction["action"] = "Roll Dice"

        # There are no details for passing control to the next player.
        transaction["details"] = None

        if (self.doubles_were_rolled == True or self.bot["doubles"] > 0) and self.bot["bankrupt"] == False:

            print('\n{} had rolled doubles and sent transaction "Roll Dice" to itself.'.format(
                self.bot["name"]))

            self.players.player_queue[self.bot["key"]].append(transaction)

        else:

            if self.bot["key"] == "car":
                next_player_key = "top_hat"
            elif self.bot["key"] == "top_hat":
                next_player_key = "shoe"
            elif self.bot["key"] == "shoe":
                next_player_key = "dog"
            elif self.bot["key"] == "dog":
                next_player_key = "car"

            self.players.player_queue[next_player_key].append(transaction)

            next_player_name = utilities.format_name_from_key(next_player_key)

            if self.bot["bankrupt"] == True:

                print('\n{} is bankrupt and sent transaction "Roll Dice" to next player {}.'.format(
                    self.bot["name"], next_player_name))

            else:

                print('\n{} did not rolled doubles and sent transaction "Roll Dice" to next player {}.'.format(
                    self.bot["name"], next_player_name))
