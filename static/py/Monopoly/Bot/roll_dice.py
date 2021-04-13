from static.py.Monopoly.Bot import process_sequence
from static.py.Monopoly.Bot import Auction
import traceback
import datetime
import random
import math
import json
import copy


def roll_dice(self):

    # Keep rolling dice until there is a break.
    while True:

        # Determine if this bot is bankrupt.
        if self.bot["bankrupt"] == True:

            print("\n{} is not rolling dice:  Bankrupt.".format(self.bot["name"]))

            # Pass control to the next player or bot when this bot is bankrupt.
            self.process_end_turn()

            # Do not roll the dice.
            break

        # Determine if this bot is in an auction.
        try:

            # Determine if Auction has global variables.
            Auction.g

            # Determine if global variables has an auction.
            if "auction" in Auction.g.keys():

                # Determine if the aution has the "in" atrribute.
                if "in" in Auction.g["auction"].keys():

                    # Determine if this bot is in an aution.
                    if Auction.g["auction"]["in"] == True:

                        # Do not roll dice if there is an auction in process.
                        print("\n{} did not roll dice because it is in an auction.".format(self.bot["name"]))

                        # Do not roll dice.
                        break

        except NameError:

            # If the global variable is not found, then assume that there is no event of any kind.
            print("\n{} is not in an auction because auction global variables were not found.".format(self.bot["name"]))

        # Roll and sum the dice.
        dice_1 = random.randint(1, 6)
        dice_2 = random.randint(1, 6)
        dice = dice_1 + dice_2
        self.dice = dice

        print("\n{} rolled {:n} and {:n} for a {:n}.".format(self.bot["name"], dice_1, dice_2, dice))

        # Determine if doubles were rolled.
        if dice_1 == dice_2:

            # Doubles were rolled
            self.bot["doubles"] += 1
            self.bot["has_rolled_doubles"] = True

        else:

            # Doubles were not rolled.
            self.bot["doubles"] = 0
            self.bot["has_rolled_doubles"] = False

        # Determine if the Bot is in Jail.
        if self.bot["jail"] == True:

            print("{} is in jail.".format(self.bot["name"]))

            # Process the Bot in Jail.
            process_roll_request_player_in_jail(self)

            # Determine if the player is still in Jail.
            if self.bot["jail"] == True:

                # Log the action.
                print("\n{} stopped rolling dice and remains in lockup.".format(self.bot["name"]))

                # Pass control to the next Player or Bot.
                self.process_end_turn()

                # Stop rolling dice.  Bot will roll again when it receives a 9 Roll Dice transaction.
                break

            # Bot was just released from Jail.
            else:

                print("\n{} continued rolling dice because it just got out of jail.".format(self.bot["name"]))

                # Reset the number_of_doubles.
                self.bot["doubles"] = 0
                self.bot["has_rolled_doubles"] = False

                # Move the bot to the lobby of the jail.
                self.bot["sequence"] = 0
                move_bot(self, 10, False)

                # The freed bot gets to roll the dice again.
                continue

        # Determine if the Bot rolled more than two doubles.
        if self.bot["doubles"] > 2:

            # Log the action.
            print("\n{} went to jail for too many doubles.".format(self.bot["name"]))

            # Bot goes to Jail.
            self.bot["doubles"] = 0
            self.bot["has_rolled_doubles"] = False
            self.bot["jail"] = True
            self.bot["rolls_in_jail"] = 0

            # Use the GO TO JAIL Property to move the Bot to Jail.
            self.bot["sequence"] = 30
            move_bot(self, 1, use_prior_sequence=True)

            # Process the property on which the bot landed, which should be the GO TO JAIL property.
            self.bot["sequence"] = 30
            process_property(self)

            # Pass control to the next player.
            self.process_end_turn()

            # Stop rolling dice.  Bot will roll again when it receives a 9 Roll Dice transaction.
            break

        # The bot is not in jail and has not rolled more than two doubles.
        # Move the bot by amount rolled by the dice.
        move_bot(self, dice)

        # Process the property on which the bot landed.
        process_property(self)

        # Bot would be in jail if it landed on the GO TO JAIL property.
        if self.bot["jail"] == True:

            print("\n{} stopped rolling dice because it is now in jail.".format(self.bot["name"]))

            # Keep bot in jail, even if rolling doubles got it here in the first place.
            self.bot["has_rolled_doubles"] = False

            # Pass control to the next Player or Bot.
            self.process_end_turn()

            # Stop rolling dice.  Bot will roll again when it receives a 9 Roll Dice transaction.
            break

        # Determine if bot did not rolled doubles.
        if self.bot["has_rolled_doubles"] == True:

            print("\n{} continued rolling dice because it did roll doubles.".format(self.bot["name"]))

            # Pass control again to the this bot.
            self.process_end_turn()

            # Stop rolling dice.  Bot will roll again when it receives a "Roll Dice" transaction.
            break

        print("\n{} stopped rolling dice because it did not roll doubles.".format(self.bot["name"]))

        # Unmortgage properties.
        self.players.unmortgage_properties(self.bot["key"])

        # Complete a color group.
        print("\n**********")
        print("{} completing color group.".format(self.bot["name"]))

        # Break if a Trade Event had started.
        if complete_a_color_group(self) == True: 
            print("A Trade Even was started.")
            print("**********")
            break
        print("A Trade Event was not started.")
        print("**********")

        # Build houses and hotels on the color groups.
        develop_color_groups(self)

        # Pass control to the next player.
        self.process_end_turn()

        # Stop rolling dice.  Bot will roll again when it receives a "Roll Dice" transaction.
        break


def process_roll_request_player_in_jail(self):

    # Determine if the Bot has rolled doubles while in Jail.
    if self.bot["has_rolled_doubles"] == True:

        # Log action.
        print("{} was released from jail by rolling doubles.".format(self.bot["name"]))

        # The Bot gets out of Jail because of rolling doubles.
        self.bot["jail"] = False

        # Put the Bot in the lobby of the Jail.
        self.bot["sequence"] = 9
        move_bot(self, 1, use_prior_sequence=False)

        # The Bot is no longer in jail.
        return

    # Increment the number of rolls while Bot is in Jail.
    self.bot["rolls_in_jail"] += 1

    # Determine if the number of rolls while Bot is in Jail.
    if self.bot["rolls_in_jail"] > 2:

        # Log the action.
        print("{}  as released from jail after three rolls and paying the fine.".format(self.bot["name"]))

        # The Bot pays the find.
        subtract_balance(self, 50)

        # TODO:  Check for net worth.  Bankruptcy if it cannot make 50.  Make payment after selling and mortgaging.

        # The Bot is released from jail.
        self.bot["jail"] = False

        # Put the Bot in the lobby of the Jail.
        self.bot["sequence"] = 9
        move_bot(self, 1, use_prior_sequence=False)

        # The Bot no longer in Jail.
        return

    # Determine if the Bot has sufficient funds.
    if self.bot["balance"] > 250:

        # Log the action.
        print("{} was released from jail after paying the fine.".format(self.bot["name"]))

        # The Bot pays the fine.
        subtract_balance(self, 50)

        # The Bot is release from Jail.
        self.bot["jail"] = False

        # Put the Bot in the lobby of the Jail.
        self.bot["sequence"] = 9
        move_bot(self, 1, use_prior_sequence=False)

        # The Bot is no longer in Jail.
        return

    # The Bot remains in lockup.
    print("{}  remains in lockup.".format(self.bot["name"]))


def move_bot(self, dice, use_prior_sequence=True):

    # Get the current sequence (position) of the Bot.
    current_sequence = self.bot["sequence"]

    # Determine the new sequence for this Bot.
    new_sequence = current_sequence + dice

    # Determine if the Bot at Go or has rounded Go.
    if new_sequence > 39:

        if new_sequence > 40:

            # Get the salary for rounding Go.
            salary = self.properties.properties["go"]["salary"]

            # Add the salary to the balance of the Bot rounding Go and notify all Players and Bots.
            add_balance(self, salary)

        # Normalize the new_sequence for the Board of 40 Properties.
        new_sequence = new_sequence - 40

    print("\n{} moved from {:n} to {:n}.".format(self.bot["name"], current_sequence, new_sequence))

    start_name = get_property_name_from_sequence(self, current_sequence)

    end_name = get_property_name_from_sequence(self, new_sequence)

    print("\n{} moved from {} to {}.".format(self.bot["name"], start_name, end_name))

    # Update the Bot with the new sequence.
    self.bot["sequence"] = new_sequence

    # Move the Bot on Boards of all Players and Bots.
    for player_key in self.players.players:

        # Define a transaction for a Player.
        transaction = {}

        # Add timestamp used for sorting.
        transaction["timestamp"] = datetime.datetime.now().isoformat()

        # Set the action attribute of the transaction.
        transaction["action"] = "Move Piece"

        # Define details for the transaction.
        details = {}
        details["target_player_key"] = self.bot["key"]
        details["dice"] = dice
        details["use_prior_sequence"] = use_prior_sequence

        # Add details to the transaction.
        transaction["details"] = details

        # Add the transaction to the queue of a Player.
        self.players.player_queue[player_key].append(transaction)


def get_property_name_from_sequence(self, sequence):

    for property in self.properties.properties.values():

        # Determine if the sequence of the property is the same as the sequence for the bot.
        if property["sequence"] == sequence:

            # Return the name of the property for the sequence.
            return property["name"]
            break


def process_property(self):

    # Define the property corresponding to the sequence.
    property = None

    # Loop through all properties.
    for property in self.properties.properties.values():

        # Determine if the sequence of the property is the same as the sequence for the bot.
        if property["sequence"] == self.bot["sequence"]:

            # The bot is sitting on this property.
            break

    # Process the property with respect to the bot (purchase, pay rent).
    process_sequence.process_sequence(self, property)


def add_balance(self, amount):

    # Get a copy of the balance as the previous balance.
    previous_balance = copy.copy(self.bot["balance"])

    # Increase the balance of the bot by the amount.
    self.bot["balance"] += amount

    # Notify all Players and Bots of the change in balance.
    for player_key in self.players.players:

        # Define a transaction for a Player
        transaction = {}

        # Add timestamp used for sorting.
        transaction["timestamp"] = datetime.datetime.now().isoformat()

        # Set the action attribute of the transaction.
        transaction["action"] = "Update Balance"

        # Define details for the transaction.
        details = {}
        details["target_player_key"] = self.bot["key"]
        details["balance"] = self.bot["balance"]

        # Add the details to the transaction.
        transaction["details"] = details

        # Add the transaction to the queue of a Player.
        self.players.player_queue[player_key].append(transaction)

    print("\n{} had its balance increased from {:n} to {:n}.".format(self.bot["name"], previous_balance, self.bot["balance"]))


def subtract_balance(self, amount):

    # Get a copy of the balance as the previous balance
    previous_balance = copy.copy(self.bot["balance"])

    # Determine if the bot has insufficient cash to make the payment.
    if amount > self.bot["balance"]:

        # Mortgage each property owned by the bot until the balances is sufficient to make the payment.
        for property_key in self.bot["property_keys"]:

            # Get a reference to the next property.
            property = self.properties.properties[property_key]

            # Mortgaged properties cannot be mortgaged.
            if property["mortgaged"] == True:
                continue

            # Developed properties cannot be mortgaged.
            if "hotels" in property.keys():
                if property["hotels"] > 0:
                    continue

            if "houses" in property.keys():
                if property["houses"] > 0:
                    continue

            # Mortgage the property.
            property["mortgaged"] = True

            # Add the mortgage value to the balance of the bot.
            self.bot["balance"] += property["mortgage"]

            # Notify each Player that a property has been mortgaged and to change the fill attribute.
            for player_key in self.players.players:

                # Define a transaction for a Player.
                transaction = {}

                # Add timestamp to the transaction for sorting.
                transaction["timestamp"] = datetime.datetime.now().isoformat()

                # Set the action attribute of the transaction.
                transaction["action"] = "Update Mortgaged"

                # Define details for the transaction.
                details = {}
                details["property"] = property

                # Add the details to the transaction.
                transaction["details"] = details

                # Add the transaction to the queue of a Player.
                self.players.player_queue[player_key].append(copy.deepcopy(transaction))

            print("\n{} just mortgaged {}.".format(self.bot["name"], property["name"]))

            # Stop mortgaging properties if the balance is sufficient to make the payment.
            if self.bot["balance"] > amount:
                break

        # TODO: If the balance is still less than amount, sell motels.
        # TODO: If the balance is still less than amount, sell houses.
        # TODO: If the balance is still less than amount, mortgage properties again.
        # TODO: If the balance is still negative, bankrupt the bot.

    # Subtract the amount from the balance of the bot.
    self.bot["balance"] -= amount

    # Notify all players and bots of the change in balance.
    for player_key in self.players.players:

        # Define a transaction for a Player
        transaction = {}

        # Add timestamp used for sorting.
        transaction["timestamp"] = datetime.datetime.now().isoformat()

        # Set the action attribute of the transaction.
        transaction["action"] = "Update Balance"

        # Define details for the transaction.
        details = {}
        details["target_player_key"] = self.bot["key"]
        details["balance"] = self.bot["balance"]

        # Add the details to the transaction.
        transaction["details"] = details

        # Add the transaction to the queue of a Player.
        self.players.player_queue[player_key].append(copy.deepcopy(transaction))

    # Balance can never be negative.  Program logic error upstream.  False turns off code.
    if self.bot["balance"] < 0 and False:

        # Log the action.
        print("\n{}  had a negative balance. Logic error. Stopping all players and bots.".format(self.bot["name"]))

        # Notify each Player that an error was encountered and stop processing.
        for player_key in self.players.players:

            # Define a transaction for a Player
            transaction = {}

            # Add timestamp to the transaction for sorting.
            transaction["timestamp"] = datetime.datetime.now().isoformat()

            # Set the action attribute of the transaction.
            transaction["action"] = "Error Encountered"

            # Define details for the transaction.
            details = {}

            # Add the details to the transaction.
            transaction["details"] = details

            # Add the transaction to the queue of a Player.
            self.players.player_queue[player_key].append(copy.deepcopy(transaction))

    print("\n{} had its balance decreased from {:n} to {:n}.".format(self.bot["name"], previous_balance, self.bot["balance"]))


def add_balance_to_other_player(self, player, amount):

    # Get a copy of the balance as the previous balance.
    previous_balance = copy.copy(player["balance"])

    # Increase the balance of the player by the amount.
    player["balance"] += amount

    # Notify all Players and Bots of the change in balance.
    for player_key in self.players.players:

        # Define a transaction for a Player
        transaction = {}

        # Add timestamp used for sorting.
        transaction["timestamp"] = datetime.datetime.now().isoformat()

        # Set the action attribute of the transaction.
        transaction["action"] = "Update Balance"

        # Define details for the transaction.
        details = {}
        details["target_player_key"] = player["key"]
        details["balance"] = player["balance"]

        # Add the details to the transaction.
        transaction["details"] = details

        # Add the transaction to the queue of a Player.
        self.players.player_queue[player_key].append(transaction)

    print("\n{} had its balance increased from {:n} to {:n}.".format(player["name"], previous_balance, player["balance"]))


def subtract_balance_from_other_player(self, player, amount):

    # Get a reference to the current player.
    player = self.players.players[player["key"]]

    # Get a copy of the balance as the previous balance
    previous_balance = copy.copy(player["balance"])

    # Determine if the bot has insufficient cash to make the payment.
    if amount > player["balance"]:

        # Mortgage each property owned by the bot until the balances is sufficient to make the payment.
        for property_key in player["property_keys"]:

            # Get a reference to the next property.
            property = self.properties.properties[property_key]

            # Mortgaged properties cannot be mortgaged.
            if property["mortgaged"] == True:
                continue

            # Developed properties cannot be mortgaged.
            if "hotels" in property.keys():
                if property["hotels"] > 0:
                    continue

            if "houses" in property.keys():
                if property["houses"] > 0:
                    continue

            # Mortgage the property.
            property["mortgaged"] = True

            # Add the mortgage value to the balance of the bot.
            player["balance"] += property["mortgage"]

            # Notify each Player that a property has been mortgaged and to change the fill attribute.
            for player_key in self.players.players:

                # Define a transaction for a Player.
                transaction = {}

                # Add timestamp to the transaction for sorting.
                transaction["timestamp"] = datetime.datetime.now().isoformat()

                # Set the action attribute of the transaction.
                transaction["action"] = "Update Mortgaged"

                # Define details for the transaction.
                details = {}
                details["property"] = property

                # Add the details to the transaction.
                transaction["details"] = details

                # Add the transaction to the queue of a Player.
                self.players.player_queue[player_key].append(copy.deepcopy(transaction))

            print("\n{} just mortgaged {}.".format(player["name"], property["name"]))

            # Stop mortgaging properties if the balance is sufficient to make the payment.
            if player["balance"] > amount:
                break

        # TODO: If the balance is still less than amount, sell motels.
        # TODO: If the balance is still less than amount, sell houses.
        # TODO: If the balance is still less than amount, mortgage properties again.
        # TODO: If the balance is still negative, bankrupt the bot.

    # Subtract the amount from the balance of the bot.
    player["balance"] -= amount

    # Notify all players and bots of the change in balance.
    for player_key in self.players.players:

        # Define a transaction for a Player
        transaction = {}

        # Add timestamp used for sorting.
        transaction["timestamp"] = datetime.datetime.now().isoformat()

        # Set the action attribute of the transaction.
        transaction["action"] = "Update Balance"

        # Define details for the transaction.
        details = {}
        details["target_player_key"] = player["key"]
        details["balance"] = player["balance"]

        # Add the details to the transaction.
        transaction["details"] = details

        # Add the transaction to the queue of a Player.
        self.players.player_queue[player_key].append(copy.deepcopy(transaction))

    # Balance can never be negative.  Program logic error upstream.  False turns off code.
    if player["balance"] < 0 and False:

        # Log the action.
        print("\n{} had a negative balance. Logic error. Stopping all players and bots.".format(player["name"]))

        # Notify each Player that an error was encountered and stop processing.
        for player_key in self.players.players:

            # Define a transaction for a Player
            transaction = {}

            # Add timestamp to the transaction for sorting.
            transaction["timestamp"] = datetime.datetime.now().isoformat()

            # Set the action attribute of the transaction.
            transaction["action"] = "Error Encountered"

            # Define details for the transaction.
            details = {}

            # Add the details to the transaction.
            transaction["details"] = details

            # Add the transaction to the queue of a Player.
            self.players.player_queue[player_key].append(copy.deepcopy(transaction))

    print("\n{} had its balance decreased from {:n} to {:n}.".format(player["name"], previous_balance, player["balance"]))


def mortgage_a_bot_property(self, bot):

    player = self.players.players[bot["key"]]

    property_keys = player["property_keys"]

    for property_key in property_keys:

        property = self.properties.properties[property_key]

        # Determine if the Property is the type that could have houses or a hotel.
        if property["type"] == "property":

            # Cannot mortgage a Property if it has a hotel.
            if property["hotels"] > 0:
                continue

            # Cannot mortgage a Property if it has a house.
            if property["houses"] > 0:
                continue

        # Cannot mortgage a Property if it is already mortgaged.
        if property["mortgaged"] == True:
            continue

        # Mortgage the Property.
        property["mortgaged"] = True

        # Add the mortgage value to the balance of the Player (Bot).
        self.players.players[bot["key"]]["balance"] += property["mortgage"]

        # Notify all Players and Bots of the change in ownership.
        process_sequence.notify_players_of_ownership_change(self, property)

        # Notify each Player that a property has been mortgaged and to change the fill attribute.
        for player_key in self.players.players:

            # Define a transaction for a Player.
            transaction = {}

            # Add timestamp to the transaction for sorting.
            transaction["timestamp"] = datetime.datetime.now().isoformat()

            # Set the action attribute of the transaction.
            transaction["action"] = "Update Mortgaged"

            # Define details for the transaction.
            details = {}
            details["property"] = property

            # Add the details to the transaction.
            transaction["details"] = details

            # Add the transaction to the queue of a Player.
            self.players.player_queue[player_key].append(copy.deepcopy(transaction))

        print("\n{} just mortgaged the bot property {}.".format(player["name"], property["name"]))

        break


def add_bot_balance(self, bot, amount):

    # Get the current state of the bot.
    player = self.players.players[bot["key"]]

    current_balance = self.players.players[bot["key"]]["balance"]

    # Calculate a new balance.
    new_balance = current_balance + amount

    # Increase the balance of the Bot by the amount.
    self.players.players[bot["key"]]["balance"] += amount

    # Notify all Players and Bots of the change in balance.
    for player_key in self.players.players:

        # Define a transaction for a Player
        transaction = {}

        # Add timestamp used for sorting.
        transaction["timestamp"] = datetime.datetime.now().isoformat()

        # Set the action attribute of the transaction.
        transaction["action"] = "Update Balance"

        # Define details for the transaction.
        details = {}
        details["target_player_key"] = bot["key"]
        details["balance"] = new_balance

        # Add the details to the transaction.
        transaction["details"] = details

        # Add the transaction to the queue of a Player.
        self.players.player_queue[player_key].append(transaction)

    print("\n{} had its balanced increased from {:n} by {:n} to {:n}.".format(bot["name"], current_balance, amount, new_balance))


def subtract_bot_balance(self, bot, amount):

    # Get a reference to the actual player.
    player = self.players.players[bot["key"]]

    # Get a copy of the balance as the previous balance
    previous_balance = copy.copy(player["balance"])

    # Determine if the bot has insufficient cash to make the payment.
    if amount > player["balance"]:

        # Mortgage each property owned by the bot until the balances is sufficient to make the payment.
        for property_key in player["property_keys"]:

            # Get a reference to the next property.
            property = self.properties.properties[property_key]

            # Mortgaged properties cannot be mortgaged.
            if property["mortgaged"] == True:
                continue

            # Developed properties cannot be mortgaged.
            if "hotels" in property.keys():
                if property["hotels"] > 0:
                    continue

            if "houses" in property.keys():
                if property["houses"] > 0:
                    continue

            # Mortgage the property.
            property["mortgaged"] = True

            # Add the mortgage value to the balance of the bot.
            player["balance"] += property["mortgage"]

            # Notify each Player that a property has been mortgaged and to change the fill attribute.
            for player_key in self.players.players:

                # Define a transaction for a Player.
                transaction = {}

                # Add timestamp to the transaction for sorting.
                transaction["timestamp"] = datetime.datetime.now().isoformat()

                # Set the action attribute of the transaction.
                transaction["action"] = "Update Mortgaged"

                # Define details for the transaction.
                details = {}
                details["property"] = property

                # Add the details to the transaction.
                transaction["details"] = details

                # Add the transaction to the queue of a Player.
                self.players.player_queue[player_key].append(copy.deepcopy(transaction))

            print("\n{} just mortgaged {}.".format(player["name"], property["name"]))

            # Stop mortgaging properties if the balance is sufficient to make the payment.
            if player["balance"] > amount:
                break

        # TODO: If the balance is still less than amount, sell motels.
        # TODO: If the balance is still less than amount, sell houses.
        # TODO: If the balance is still less than amount, mortgage properties again.
        # TODO: If the balance is still negative, bankrupt the bot.

    # Subtract the amount from the balance of the bot.
    player["balance"] -= amount

    # Notify all players and bots of the change in balance.
    for player_key in self.players.players:

        # Define a transaction for a Player
        transaction = {}

        # Add timestamp used for sorting.
        transaction["timestamp"] = datetime.datetime.now().isoformat()

        # Set the action attribute of the transaction.
        transaction["action"] = "Update Balance"

        # Define details for the transaction.
        details = {}
        details["target_player_key"] = player["key"]
        details["balance"] = player["balance"]

        # Add the details to the transaction.
        transaction["details"] = details

        # Add the transaction to the queue of a Player.
        self.players.player_queue[player_key].append(copy.deepcopy(transaction))

    # Balance can never be negative.  Program logic error upstream.  False turns off code.
    if player["balance"] < 0 and False:

        # Log the action.
        print("\n{}  had a negative balance. Logic error. Stopping all players and bots.".format(player["name"]))

        # Notify each Player that an error was encountered and stop processing.
        for player_key in self.players.players:

            # Define a transaction for a Player
            transaction = {}

            # Add timestamp to the transaction for sorting.
            transaction["timestamp"] = datetime.datetime.now().isoformat()

            # Set the action attribute of the transaction.
            transaction["action"] = "Error Encountered"

            # Define details for the transaction.
            details = {}

            # Add the details to the transaction.
            transaction["details"] = details

            # Add the transaction to the queue of a Player.
            self.players.player_queue[player_key].append(copy.deepcopy(transaction))

    print("\n{} had its balance decreased from {:n} by {:n} to {:n}.".format(player["name"], previous_balance, amount, player["balance"]))


def append_bot_property(self, bot, property):

    # Validate parameter "bot".
    try:
        bot_key = bot["key"]

    except Exception as e:
        print("\nError: roll_dice.py: append_bot_property(self, bot, property")
        print("Exception: " + str(e))
        traceback.print_exc()
        set_error_encountered()

    # Validate parameter "property".
    try:
        property_key = property["key"]

    except Exception as e:
        print("\nError 2: roll_dice.py: append_bot_property(self, bot, property")
        print("Exception: " + str(e))

    # Assign the Bot to the Property.
    self.properties.properties[property_key]["owner"] = bot_key

    # Assign the Property to the Bot.

    if property_key not in self.players.players[bot_key]["property_keys"]:
        self.players.players[bot_key]["property_keys"].append(property_key)
    else:
        print("\nError: roll_dice.py: append_bot_property(self, bot, property)")
        print("Exception: " + "Duplicate entry.")
        print("str(type(bot)): " + str(type(bot)))
        print("str(type(property)): " + str(type(property)))
        print("bot: ")
        print(json.dumps(bot, indent=4))
        print("property: ")
        print(json.dumps(property, indent=4))
        # self.set_error_encountered()

    # Get the current state of the property.
    property = self.properties.properties[property_key]

    # Notify all Players and Bots of the change in ownership.
    process_sequence.notify_players_of_ownership_change(self, property)

    print("\n{} just acquired {}.".format(bot["name"], property["name"]))
    return


def remove_bot_property(self, bot, property):

    # Validate the parameter "bot".
    try:
        bot_key = bot["key"]

    except Exception as e:
        print("\nError: roll_dice.py: remove_bot_property(self, bot, property")
        print("Exception: " + str(e))
        traceback.print_exc()
        set_error_encountered()

    # Validate the parameter "property".
    try:
        property_key = property["key"]

    except Exception as e:
        print("\nError: roll_dice.py: remove_bot_property(self, bot, property")
        print("Exception: " + str(e))
        traceback.print_exc()
        set_error_encountered()

    # Remove the Property from the Bot.
    try:
        self.players.players[bot_key]["property_keys"].remove(property_key)

        print("\n{} just relinquished property {}.".format(bot["name"], property["name"]))

    except Exception as e:
        print("\nError: roll_dice.py: remove_bot_property(self, bot, property)")
        print("Exception: " + str(e))
        print("str(type(bot)): " + str(type(bot)))
        print("str(type(property)): " + str(type(property)))
        print("bot: ")
        print(json.dumps(bot, indent=4))
        print("property: ")
        print(json.dumps(property, indent=4))
        # self.set_error_encountered()


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

def complete_a_color_group(self):

    if len(self.bot["property_keys"]) == 0:
        print("{} has owns no properties".format(self.bot["name"]))

    # Loop through the properties owned by the bot.
    for property_key in self.bot["property_keys"]:

        # Get the next property.
        property = self.properties.properties[property_key]

        # Get the color group for the property.
        color_group = self.properties.color_groups[property["color"]]

        # Determine how many properties in the property group are owned by the bot.
        properties_owned = 0
        number_of_properties = 0
        for color_group_member in color_group:
            number_of_properties += 1
            if self.bot["key"] == self.properties.properties[color_group_member["key"]]["owner"]:
                properties_owned += 1

        # Determine if the bot already owns the color group.
        if properties_owned == number_of_properties:

            # The bot already owns the dolor group.  Go to the next property.
            print("{} already owns the color group {}.".format(self.bot["name"], property["color"]))
            continue

        # Determine if there is only one more property necessary to complete the color group.
        if (number_of_properties - properties_owned) == 1:

            print("{} owns {:n} of {:n} properties of color group {}.".format(self.bot["name"], properties_owned, number_of_properties, property["color"]))

            # Determine the identifier of the player that owns the other property.
            for color_group_member in color_group:
                if self.bot["key"] != self.properties.properties[color_group_member["key"]]["owner"]:
                    other_player_key = self.properties.properties[color_group_member["key"]]["owner"]
                    property_key = color_group_member["key"]
                    break

            # Determine if the owner is a player.
            if other_player_key not in self.players.players.keys():

                # It is likely the property is owned by the bank or the board.  Go to the next property.
                print("Property {} is bypassed because the key of the other player is {}.".format(property["name"], other_player_key))
                continue

            if (property["price"] * 2) > self.bot["balance"]:

                # It is likely the property is owned by the bank or the board.  Go to the next property.
                print("Property {} is bypassed because double the price is greater than balance.".format(property["name"]))
                continue

            # Define offer transaction.
            transaction = {}

            # Add timestamp to the transaction for sorting.
            transaction["timestamp"] = datetime.datetime.now().isoformat()

            # Add the trade action to the counter transaction.
            transaction["action"] = "Trade"

            # Define the details for the counter transaction.
            details = {}

            # Populate the details with the trade parameters.
            details["mode"] = "offer"
            details["in"] = True
            details["player"] = self.players.players[self.bot["key"]]
            details["other_player"] = self.players.players[other_player_key]
            details["money"] = {}
            details["money"]["player"] = property["price"] * 2
            details["money"]["other_player"] = 0
            details["property"] = {}
            details["property"]["player"] = {}
            details["property"]["player"]["a"] = None
            details["property"]["player"]["b"] = None
            details["property"]["player"]["c"] = None
            details["property"]["other_player"] = {}
            details["property"]["other_player"]["a"] = self.properties.properties[property_key]
            details["property"]["other_player"]["b"] = None
            details["property"]["other_player"]["c"] = None

            # Add the details to the transaction.
            transaction["details"] = details

            # Send the offer transaction to the owner of the property not owned by the bot.
            self.players.player_queue[other_player_key].append(copy.deepcopy(transaction))

            print("{} submitted a trade offer to {}.".format(self.bot["name"], self.players.players[other_player_key]["name"]))

            print("transaction:")
            print(json.dumps(transaction, indent=4))

            # The Trade Event has begun.
            return True

        else:

            print("{} only owned {:n} of {:n} properties of color group {}.".format(self.bot["name"], properties_owned, number_of_properties, property["color"]))

    return False

def develop_color_groups(self):

    if len(self.bot["property_keys"]) == 0:
        print("{} has owns no properties".format(self.bot["name"]))

    # Loop through the properties owned by the bot.
    for property_key in self.bot["property_keys"]:

        # Get the next property.
        property = self.properties.properties[property_key]

        # Determine the property can be developed.
        if "hotels" not in property.keys(): continue
        if "houses" not in property.keys(): continue

        # Get the color group for the property.
        color_group = self.properties.color_groups[property["color"]]

        # Determine how many properties in the property group are owned by the bot.
        properties_owned = 0
        number_of_properties = 0
        number_of_hotels = 0
        for color_group_member in color_group:
            number_of_properties += 1
            if self.bot["key"] == self.properties.properties[color_group_member["key"]]["owner"]:
                properties_owned += 1
                if "hotels" in color_group_member.keys():
                    number_of_hotels += self.properties.properties[color_group_member["key"]]["hotels"]

        # Determine if the bot does not own the color group.
        if properties_owned != number_of_properties:

            # The bot does not own every property in the color group and cannot develop it.
            continue

        # Determine if the color group is fully developed.
        if number_of_hotels >= number_of_properties:

            # The color group is fully developed and no further development is allowed.
            continue

        # Build houses and hotels in the color group.
        for color_group_member in color_group:

            # Get the key of the next property in the color group.
            property_key = color_group_member["key"]

            # Build a house or hotel on the property.
            self.properties.build_house_or_hotel(property_key)

        




