# Make compilation units available.
from static.py.Monopoly import Players
from static.py.Monopoly import Properties
from static.py.Monopoly import Community_Chest
from static.py.Monopoly import Chance
import copy
import json
import traceback
import datetime
import random


class Monopoly:
    def __init__(self):

        # Define the container for the four games.
        self.games = {}

        # Instantiate each of the four games.
        for i in range(1, 5):

            self.games[i] = {}

            # Instantiated objects from the compilation units.
            self.games[i]["players"] = Players.Players()
            self.games[i]["properties"] = Properties.Properties()
            self.games[i]["community_chest"] = Community_Chest.Community_Chest()
            self.games[i]["chance"] = Chance.Chance()

            # Initialize error condition.
            self.game[i]["error_encountered"] = False

    # Process the transaction called from app.py in Flask.
    def process_transaction(self, app, requests, transaction):

        self.app = app

        self.requests = requests

        # The word "ampersand" is used as a placeholder for the "&" character.
        try:
            transaction = transaction.replace("ampersand", "&")

        except Exception as e:
            print("\n**********")
            print("Error: Monopoly.py: Monopoly: process_transaction")
            print("Exception: " + str(e))
            print('Attempting to replace "ampersand" with "&".')
            print("Transaction Type: " + str(type(transaction)))
            print("Transaction: " + transaction)
            print("**********")
            traceback.print_exc()

            # Return a fail response.
            self.status = "Fail"
            self.object = None
            return self.format_response()

            # Messages and buttons.
            self.message = None
            self.buttons = None
            self.command = None

        # Convert the string transaction into a dictionary.
        try:
            transaction = json.loads(transaction)

        except Exception as e:
            print("\n**********")
            print("Error: Monopoly.py: Monopoly: process_transaction")
            print("Exception: " + str(e))
            print("Attempting to load the transaction into a dictionary.")
            print("Transaction Type: " + str(type(transaction)))
            print("Transaction: " + transaction)
            print("**********")
            traceback.print_exc()

            # Return a fail response.
            self.status = "Fail"
            self.object = None
            return self.format_response()

        # Extract the game key, game, players, and properties from the transaction.
        try:
            self.game_key = transaction["game_key"]

            self.game = self.games[self.game_key]

            self.players = self.game["players"].players

            self.properties = self.game["properties"].properties

        except Exception as e:

            print("\n**********")
            print("Error: Monopoly.py: Monopoly: process_transaction")
            print("Exception: " + str(e))
            print("Attempting to extract the game key from the transaction.")
            print("Transaction Type: " + str(type(transaction)))
            print("Transaction: " + transaction)
            print("**********")
            traceback.print_exc()

            # Return a fail response.
            self.status = "Fail"
            self.object = None
            return self.format_response()

        # Extract the player key and player from the transaction.
        try:
            # Set the global variable for the key of the player.
            self.player_key = transaction["player_key"]

            # Get a reference to the player.
            self.player = self.players[self.player_key]

            # Set the global variable for the name of the player.
            self.player_name = self.player["name"]

        except Exception as e:

            print("\n**********")
            print("Error: Monopoly.py: Monopoly: process_transaction")
            print("Exception: " + str(e))
            print("Attempting to extract the player from the transaction.")
            print("Transaction Type: " + str(type(transaction)))
            print("Transaction: " + transaction)
            print("**********")
            traceback.print_exc()

            # Return a fail response.
            self.status = "Fail"
            self.object = None
            return self.format_response()

        # Extract the action from the transaction.
        try:
            self.transaction_action = transaction["action"]

        except Exception as e:

            print("\n**********")
            print("Error: Monopoly.py: Monopoly: process_transaction")
            print("Exception: " + str(e))
            print("Attempting to extract the action from the transaction.")
            print("Transaction Type: " + str(type(transaction)))
            print("Transaction: " + transaction)
            print("**********")
            traceback.print_exc()

            # Return a fail response.
            self.status = "Fail"
            self.object = None
            return self.format_response()

        # Extract property, other player, and message from transaction details.
        try:
            # Extract the details from the transaction.
            self.details = transaction["details"]

            # Determine if the details includes a property key.
            if "property_key" in self.details.keys():

                # Set the global variable for property key.
                self.property_key = self.details["property_key"]

                # Set the global variable for the associated property.
                self.property = self.properties[self.property_key]

                # Set the global variable for property name.
                self.property_name = self.property["name"]

                # Set the global variable for the property owner key.
                self.property_owner_key = self.property["owner_key"]

                # Get a reference to the owner of the property.
                self.property_owner = self.players[self.property_owner_key]

                # Set the global variable for the name of the property_owner.
                self.property_owner_name = self.property_owner["name"]

            else:
                self.property_key = None
                self.property = None

            # Determine if the details includes the key of the other player.
            if "other_player_key" in self.details.keys():

                # Set the global variable for the other player key.
                self.other_player_key = self.details["other_player_key"]

                # Set the global variable for the other player.
                self.other_player = self.players[self.other_player_key]

                # Set the global variable for the name of the other player.
                self.other_player_name = self.other_player["name"]

            else:
                self.other_player_key = None
                self.other_player = None

            # Determine if the details includes a message.
            if "message" in self.details.keys():

                # Set the global variable for the message.
                self.message = self.details["message"]

            else:
                self.message = None

            # Determine if the details includes a previous sequence, used in testing move_message function.
            if "previous_sequence" in self.details.keys():

                # Set the global variable for the message.
                self.previous_sequence = self.details["previous_sequence"]

            else:
                self.previous_sequence = None

            # Determine if the details includes a current sequence, used in testing move_message function.
            if "current_sequence" in self.details.keys():

                # Set the global variable for the message.
                self.current_sequence = self.details["current_sequence"]

            else:
                self.current_sequence = None

        except Exception as e:

            print("\n**********")
            print("Error: Monopoly.py: Monopoly: process_transaction")
            print("Exception: " + str(e))
            print("Attempting to extract the details from the transaction.")
            print("Transaction Type: " + str(type(transaction)))
            print("Transaction: " + transaction)
            print("**********")
            traceback.print_exc()

            # Return a fail response.
            self.status = "Fail"
            self.object = None
            return self.format_response()

        # TODO:  Add process_property_type_property
        # TODO:  Start here with login.
        # TODO:  Start here with rolling dice.
        # TODO:  Send a response to the client with the granular message.
        # TODO:  Get the player in the game and determine if too many doubles.
        # TODO:  If doubles, update the player in the game.
        # TODO:  Send granular movements to the queue of the player in the game.
        # TODO:  Process the sequence after all movements.

        # Assign a Player to the current Board.
        if transaction_action == "Assign Player":
            return self.assign_player(api=True)

        # Add get-out-of-jail card to the player.
        if transaction_action == "Add Get Out Of Jail Card":
            return self.add_get_out_of_jail_card(api=True)

        # Set player to incarcerated status.
        if transaction_action == "Move Player Into Jail":
            return self.move_player_into_jail(api=True)

        # Set player to freedom status.
        if transaction_action == "Get Player Out Of Jail":
            return self.get_player_out_of_jail(api=True)

        # Bankrupt a player and move all assets to another player or the bank.
        if transaction_action == "Bankrupt The Player":
            return self.bankrupt_the_player(api=True)

        # Check if there are enough Players to start the game.
        if transaction_action == "Get Number Of Assigned Players":
            return self.get_number_of_assigned_players(api=True)

        # Get the winner.
        if transaction_action == "Get The Winner":
            return self.get_the_winner(api=True)

        # Get the Community Chest instantiation.
        if transaction_action == "Get Community Chest":
            return self.get_community_chest(api=True)

        # Get the Chance instantiation.
        if transaction_action == "Get Chance":
            return self.get_chance(api=True)

        # Log message.
        if self.transaction_action == "Log Message":
            return self.log_message(api=True)

        # Send a message to a single player.
        if self.transaction_action == "Send Message To A Player":
            return self.send_message_to_a_player(api=True)

        # Send a message to all players.
        if self.transaction_action == "Send Message To All Players":
            return self.send_message_to_all_players(api=True)

        # An error was encountered.
        if self.transaction_action == "Set Error Encountered":
            return self.set_error_encountered(api=True)

        # Get a sorted queue of a player and then clear it.
        if transaction_action == "Get And Clear Queue":
            return self.get_and_clear_queue(api=True)

        # Get a player.
        if transaction_action == "Get Player":
            return self.get_player(api=True)

        # Get a players.
        if transaction_action == "Get Players":
            return self.get_players(api=True)

        # Get Player Net Worth.
        if transaction_action == "Get Player Net Worth":
            return self.get_player_net_worth(api=True)

        # Get a property.
        if transaction_action == "Get Property":
            return self.get_property(api=True)

        # Get properties.
        if transaction_action == "Get Properties":
            return self.get_properties(api=True)

        # Build house or hotel.
        if transaction_action == "Build House Or Hotel":
            return self.build_house_or_hotel(api=True)

        # Build houses or hotels.
        if transaction_action == "Build Houses Or Hotels":
            return self.build_houses_or_hotels(api=True)

        # Sell house or hotel.
        if transaction_action == "Sell House Or Hotel":
            return self.sell_house_or_hotel(api=True)

        # Sell houses or hotels until the payment is met.
        if transaction_action == "Sell Houses Or Hotels":
            return self.sell_houses_or_hotels(api=True)

        # Mortgage a property.
        if transaction_action == "Mortgage Property":
            return self.mortgage_property(api=True)

        # Mortgage properties until the payment is met.
        if transaction_action == "Mortgage Properties":
            return self.mortgage_properties(api=True)

        # Unmortgage a property.
        if transaction_action == "Unmortgage Property":
            return self.unmortgage_property(api=True)

        # Unmortgage properties until the payment is met.
        if transaction_action == "Unmortgage Properties":
            return self.unmortgage_properties(api=True)

        # Process the property where the player is located.
        if transaction_action == "Process Property":
            return self.process_property(api=True)

        # Process the property type Go.
        if transaction_action == "Process Property Type Go":
            return self.process_property_type_go(api=True)

        # Process the property type Community Chest.
        if transaction_action == "Process Property Type Community Chest":
            return self.process_property_type_community_chest(api=True)

        # Process the property type Chance.
        if transaction_action == "Process Property Type Chance":
            return self.process_property_type_chance(api=True)

        # Process the property type tax.
        if transaction_action == "Process Property Type Tax":
            return self.process_property_type_tax(api=True)

        # Get the maximum number of houses or hotel in a color group.
        if transaction_action == "Maximum Number Of Houses Or Hotel In Color Group":
            return self.maximum_number_of_houses_or_hotel_in_color_group(api=True)

        # Determine if a player owns a color group.
        if transaction_action == "Player Owns Color Group":
            return self.player_owns_color_group(api=True)

        # Update the balance of a player on the boards of all players.
        if transaction_action == "Update Player Balance":
            return self.update_player_balance(api=True)

        # Update the owner of the property on the boards of all players.
        if transaction_action == "Update Property Owner":
            return self.update_property_owner(api=True)

        # Hide the house or hotel on the boards of all players.
        if transaction_action == "Hide House Or Hotel":
            return self.hide_house_or_hotel(api=True)

        # Unhide the house or hotel on the boards of all players.
        if transaction_action == "Unhide House Or Hotel":
            return self.unhide_house_or_hotel(api=True)

        # Update the class of a property icon on the boards of all players.  Updated are owner and mortgaged attributes.
        if transaction_action == "Update Property Icon Class":
            return self.unhide_house_or_hotel(api=True)

        # Update the mortgaged attribute of a property on the boards of all players.
        if transaction_action == "Update Property Mortgaged":
            return self.update_property_mortgaged(api=True)

        # Get the sorted queue of a player.
        if transaction_action == "Get Player Queue":
            return self.get_player_queue(api=True)

        # Make the payment.
        if transaction_action == "Make The Payment":
            return self.make_the_payment(api=True)

        # Make an offer.
        if transaction_action == "Make An Offer":
            return self.make_an_offer(api=True)

        # Make a counter offer.
        if transaction_action == "Make A Counter Offer":
            return self.make_a_counter_offer(api=True)

        # Reject the offer.
        if transaction_action == "Reject The Offer":
            return self.reject_the_offer(api=True)

        # Accept the offer.
        if transaction_action == "Accept The Offer":
            return self.accept_the_offer(api=True)

        # Cancel the offer.
        if transaction_action == "Cancel The Offer":
            return self.cancel_the_offer(api=True)

        # Unhide the trade screen.
        if transaction_action == "Unhide The Trade Screen":
            return self.unhide_the_trade_screen(api=True)

        # Hide the trade screen.
        if transaction_action == "Hide The Trade Screen":
            return self.hide_the_trade_screen(api=True)

        # Make a bid.
        if transaction_action == "Make A Bid":
            return self.make_a_bid(api=True)

        # Make fold.
        if transaction_action == "Fold":
            return self.make_a_fold(api=True)

        # Make unhide the auction screen.
        if transaction_action == "Unhide The Auction Screen":
            return self.unhide_the_auction_screen(api=True)

        # Make hide the auction screen.
        if transaction_action == "Hide The Auction Screen":
            return self.hide_the_auction_screen(api=True)

        # Roll the dice.
        if transaction_action == "Roll The Dice":
            return self.roll_the_dice(api=True)

        # End turn.
        if transaction_action == "End Turn":
            return self.end_turn(api=True)

        # Buy the property.
        if transaction_action == "Buy The Property":
            return self.buy_the_property(api=True)

        # Invalid transaction action.
        return self.invalid_transaction_action(api=True)

    def set_error_encountered(self, api=False):

        try:
            # Format the error message.
            self.message = "An error occurred.  Check server log."

            # Send the error message to all players.
            self.send_message_to_all_players()

            # Command all players to stop.
            self.command = "Stop"

            # Send the command to all players.
            self.send_command_to_all_players()

            # Determine if this function was called from an API call.
            if api == True:

                # Return a pass response.
                self.status = "Pass"
                self.object = None
                return self.format_response()

            else:

                return None

        except Exception as e:

            print("\n**********")
            print("Error: Monopoly.py: Monopoly: set_error_encountered")
            print("Exception: " + str(e))
            print("**********")
            raise Exception("Exception occurred in set_error_encountered.")

    def format_response(self):

        try:
            # Define the local status.
            response = {}

            # Get a copy of the global status.
            response["status"] = copy.copy(self.status)

            # Get a reference to the global object.
            if self.object is None:
                response["object"] = None
            else:
                response["object"] = self.object

            # Convert the response dictionary into a string.
            response = json.dumps(response)

            # Format the response to be used by a browser.
            response = self.app.response_class(response=response, status=200, mimetype="application/json")

            # Store the response as a global response.  
            self.response = response

            # Return the local response.
            return response

        except Exception as e:

            print("\n**********")
            print("Error: Monopoly.py: Monopoly: format_response")
            print("Exception: " + str(e))
            print("**********")
            raise Exception("Exception occurred in format_response.")

    def assign_player(self, api=False):

        try:
            # Determine if the player is already assigned.
            if self.player["assigned"] == True:

                # Indicate that the player was not just assigned.
                self.object = {"just_assigned": False}

                # Format the message that the player is already assigned.
                self.message = "Bummer.  {} was already assigned.".format(self.player_name)

                # Send the message to the player.
                self.send_message_to_a_player()

            else:

                # Assigning the user to the player.
                player["assigned"] = True

                # Indicate that the player was just assigned.
                self.object = {"just_assigned": True}

                # Format message that the player is assigned.
                self.message = "Success! You have been assigned {}.".format(self.player_name)

                # Send the message to the player.
                self.send_message_to_a_player()

            # Determine if this function was called as an API.
            if api == True:

                # Format a pass response.
                self.status = "Pass"
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Error: Monopoly.py: Monopoly: assign_player")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def add_get_out_of_jail_card(self, api=False):

        try:
            # Increment the "Get Out Of Jail Cards".
            self.player["cards"] += 1

            # Format the message that a get-out-of-jail card was added to the player.
            self.message = "Get-Out-Of_Jail card was added to {}.".format(self.player_name)

            # Send the message to the player.
            self.send_message_to_all_players()

            # Display buttons.
            self.determine_buttons_to_be_displayed()

            # Determine if this function was called as an API.
            if api == True:

                # Format a pass response.
                self.status = "Pass"
                self.object = copy.deepcopy(self.player)
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: add_get_out_of_jail_cards")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def move_player_into_jail(self, api=False):

        try:
            # Set the jail attribute of the player.
            self.player["jail"] = True
            self.player["doubles"] = 0
            self.player["rolls_in_jail"] = 0

            # Set the command.
            self.command_details = {}
            self.command_details["command"] = "Move Player Into Jail"
            self.command_details["player_key"] = copy.copy(self.player_key)

            # Send the command to all players.
            self.send_command_to_all_players()

            # Format a message that the player is in jail.
            self.message = "{} is now in lockup.".format(self.player_name)

            # Send the message to all players.
            self.send_message_to_all_players()

            # Set buttons for the player.
            self.buttons = ["End Game"]

            # Send button to the player.
            self.send_button_to_a_player()

            # Determine if this function was called as an API.
            if api == True:

                # Format a pass response.
                self.status = "Pass"
                self.object = {"command_details": self.command_details}
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: move_player_into_jail")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def get_player_out_of_jail(self, api=False):

        try:
            # Get the player out of jail.
            self.player["jail"] = False
            self.player["doubles"] = 0
            self.player["rolls_in_jail"] = 0

            # Define details.
            self.command_details = {}
            self.command_details["command"] = "Move Player To Lobby"
            self.command_details["target_player_key"] = self.player_key

            # Send the command to all players.
            self.send_command_to_all_players()

            # Format message indicating the player is out of jail.
            self.message = "{} is now in the lobby of the jail.".format(self.player_name)

            # Send the message to all players.
            self.send_message_to_all_players()

            # Display buttons.
            self.determine_buttons_to_be_displayed()

            # Determine if this function was called as an API.
            if api == True:

                # Format a pass response.
                self.status = "Pass"
                self.object = {"command_details": self.command_details}
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: get_player_out_of_jail")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def bankrupt_the_player(self, api=False):

        try:
            # Determine if another player is causing the bankruptcy.
            if self.other_player_key != None:

                # Transfer balance from bankrupt player to the player causing the bankruptcy.
                self.other_player["balance"] += self.player["balance"]

                # Update the balance of the other player in the games of all other players.
                self.update_player_balance(player_key=self.other_player_key)

            # Set the balance of the bankrupt player to zero.
            self.player["balance"] = 0

            # Update the balance of the player in the games of all players.
            self.update_player_balance()

            # Loop through the properties owned by the bankrupt player.
            for self.property_key in self.player["property_keys"]:

                # Get a reference to the next property.
                self.property = self.properties[self.property_key]

                # Set the owner of property owned by the bankrupt player to be the key of the other player.
                self.property["owner_key"] = self.other_player_key

                # Determine that the other player is not the bank.
                if self.other_player != None:

                    # Add the key of the property to the property keys of the other player.
                    self.other_player["property_keys"].append(self.property_key)

                # Update the owner of the property in the games of all players.
                self.update_property_owner()

                # Update the class of the property icon in the games of all players.
                self.update_property_icon_class()

            # Remove the property keys from the bankrupt player.
            self.player["property_keys"] = []

            # Format command details.
            self.command_details = {}
            self.command_details["command"] = "Move Player To Poorhouse"
            self.command_details["target_player_key"] = copy.copy(self.player_key)

            # Send the command to all players.
            self.send_command_to_all_players()

            # Format the message that indicates the player is in the poorhouse.
            self.message = "Bummer!  {} is now bankrupt.".format(self.name)

            # Send the message to all players.
            self.send_message_to_all_players()

            # The player can only end the game.
            self.buttons = ["End Game"]

            # Send the buttons to the player.
            self.send_buttons_to_a_player()

            # Determine if this function was called as an API.
            if api == True:

                # Format a pass response.
                self.status = "Pass"
                self.object = copy.deepcopy(self.player)
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: bankrupt_the_player")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def get_number_of_assigned_players(self, api=False):

        # Define players assigned.
        number_assigned = 0

        try:
            # Loop through the players in the game.
            for player in self.players.values():

                # Increment the assigned players.
                if player["assigned"]:
                    number_assigned += 1

            # Format a pass response suitable for a browser.
            self.status = "Pass"
            self.object = {"number_of_assigned_players": number_assigned}
            self.format_response()

            # Determine if the function was called as an API call.
            if self.api == True:

                # Return the resonse suitable for a browser.
                return self.response

            else:

                # Return the number of players that have been assigned.
                return copy.copy(number_assigned)

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: process_transaction: get_number_of_assigned_players")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def get_the_winner(self, api=False):

        # Define the variable to hold the winning player.
        winner = None

        # Initialize the number of bankrupt players.
        number_of_bankrupt = 0

        try:
            # Loop through players.
            for player in self.players.values():

                # Determine if the player is bankrupt.
                if player["bankrupt"] == True:

                    # Count the bankrupt player.
                    number_of_bankrupt += 1

                else:

                    # Capture the potential winning player.
                    winner = player

            # The game ends when three of the four players are bankrupt.
            if number_of_bankrupt > 2:

                # Format the message that there is a winner.
                self.message = "{} is the winner.".format(self.winner["name"])

                # Send the message to all players.
                self.send_message_to_all_players()

                # Format the command details.
                self.command_details = {}
                self.command_details["command"] = "Stop"
                self.command_details["reason"] = "There is a winner!"

                # Send the command to all users.
                self.send_command_to_all_players()

            # Determine if this function was called from an API call.
            if api == True:

                # Format a pass response.
                self.status = "Pass"
                self.object = {"command_details": self.command_details}
                return self.format_response()

            else:

                # Return the winner.
                return winner

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: get_the_winner")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def move_player(self, api=False):

        try:
            # Format command details.
            self.command_details = {}
            self.command_details["command"] = "Move Player"
            self.command_details["target_player_key"] = self.player_key
            self.command_details["sequence"] = self.player["sequence"]

            # Send the command to all players.
            self.send_command_to_all_players()

            # Determine if this function was called from an API call.
            if api == True:

                # Format a pass response.
                self.status = "Pass"
                self.object = {"command_details": self.command_details}
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: move_player")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def move_message(self, api=False):

        try:
            # Get property names.
            previous_property_name = self.properties[self.previous_sequence]["name"]
            current_property_name = self.properties[self.current_sequence]["name"]

            # Format message.
            self.message = "{} moved from {} to {}.".format(self.player["name"], previous_property_name, current_property_name)

            # Send the message to all players.
            self.send_message_to_all_players()

            # Determine if this function was called from an API call.
            if api == True:

                # Format a pass response.
                self.status = "Pass"
                self.object = {"message": self.message}
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: move_message")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def move_player_multiple_times(self, api=False):

        try:
            # Get the current sequence of the player.
            self.current_sequence = self.player["sequence"]

            # Determine the change in sequence of the player.
            if self.current_sequence == self.previous_sequence:

                # There is no movement.
                pass

            # Determine if the player circled the board.
            elif self.current_sequence < self.previous_sequence:

                # Determine if the player started on the bottom edge:
                if self.previous_sequence < 10:

                    # Move the player to the lobby of the Jail.
                    self.player["sequence"] = 10
                    self.move_player()

                    # Move the player to Free Parking.
                    self.player["sequence"] = 20
                    self.move_player()

                    # Move the player to Go To Jail
                    self.player["sequence"] = 30
                    self.move_player()

                    # Move the player to Go and collect 200.
                    self.player["sequence"] = 0
                    self.move_player()
                    self.process_property()

                    # Move the player to the lower edge.
                    self.player["sequence"] = current_sequence
                    self.move_player()
                    self.move_message()

                # Determine if the player started on the left edge.
                elif self.previous_sequence < 20:

                    # Determine if the player ended on the bottom edge.
                    if current_sequence < 11:

                        # Move the player to Free Parking.
                        self.player["sequence"] = 20
                        self.move_player()

                        # Move the player to Go To Jail
                        self.player["sequence"] = 30
                        self.move_player()

                        # Move the player to Go and collect 200.
                        self.player["sequence"] = 0
                        self.move_player()
                        self.process_property()

                        # Move the player to the lower edge.
                        self.player["sequence"] = current_sequence
                        self.move_player()
                        self.move_message()

                    # Determine if the player ended on the left edge.
                    elif current_sequence < 21:

                        # Move the player to Go To Jail
                        self.player["sequence"] = 30
                        self.move_player()

                        # Move the player to Go and collect 200.
                        self.player["sequence"] = 0
                        self.move_player()
                        self.process_property()

                        # Move the player to the lobby of the Jail.
                        self.player["sequence"] = 10
                        self.move_player()

                        # Move the player to the lower edge.
                        self.player["sequence"] = current_sequence
                        self.move_player()
                        self.move_message()

                # Determine if the player started on the top edge.
                elif self.previous_sequence < 30:

                    # Determine if the player ended on the bottom edge.
                    if current_sequence < 11:

                        # Move the player to Go To Jail
                        self.player["sequence"] = 30
                        self.move_player()

                        # Move the player to Go and collect 200.
                        self.player["sequence"] = 0
                        self.move_player()
                        self.process_property()

                        # Move the player to the lower edge.
                        self.player["sequence"] = current_sequence
                        self.move_player()
                        self.move_message()

                    # Determine if the player ended on the left edge.
                    elif current_sequence < 21:

                        # Move the player to Go To Jail
                        self.player["sequence"] = 30
                        self.move_player()

                        # Move the player to Go and collect 200.
                        self.player["sequence"] = 0
                        self.move_player()
                        self.process_property()

                        # Move the player to the lobby of the Jail.
                        self.player["sequence"] = 10
                        self.move_player()

                        # Move the player to the left edge.
                        self.player["sequence"] = current_sequence
                        self.move_player()
                        self.move_message()

                    # Determine if the player ended on the top edge.
                    elif current_sequence < 31:

                        # Move the player to Go To Jail
                        self.player["sequence"] = 30
                        self.move_player()

                        # Move the player to Go and collect 200.
                        self.player["sequence"] = 0
                        self.move_player()
                        self.process_property()

                        # Move the player to the lobby of the Jail.
                        self.player["sequence"] = 10
                        self.move_player()

                        # Move the player to Free Parking
                        self.player["sequence"] = 20
                        self.move_player()

                        # Move the player to the top edge.
                        self.player["sequence"] = current_sequence
                        self.move_player()
                        self.move_message()

                # Determine if the player started on the right edge.
                elif self.previous_sequence < 40:

                    # Determine if the player ended on the bottom edge.
                    if current_sequence < 11:

                        # Move the player to Go and collect 200.
                        self.player["sequence"] = 0
                        self.move_player()
                        self.process_property()

                        # Move the player to the lower edge.
                        self.player["sequence"] = current_sequence
                        self.move_player()
                        self.move_message()

                    # Determine if the player ended on the left edge.
                    elif current_sequence < 21:

                        # Move the player to Go and collect 200.
                        self.player["sequence"] = 0
                        self.move_player()
                        self.process_property()

                        # Move the player to the lobby of the Jail.
                        self.player["sequence"] = 10
                        self.move_player()

                        # Move the player to the left edge.
                        self.player["sequence"] = current_sequence
                        self.move_player()
                        self.move_message()

                    # Determine if the player ended on the top edge.
                    elif current_sequence < 31:

                        # Move the player to Go and collect 200.
                        self.player["sequence"] = 0
                        self.move_player()
                        self.process_property()

                        # Move the player to the lobby of the Jail.
                        self.player["sequence"] = 10
                        self.move_player()

                        # Move the player to Free Parking
                        self.player["sequence"] = 20
                        self.move_player()

                        # Move the player to the top edge.
                        self.player["sequence"] = current_sequence
                        self.move_player()
                        self.move_message()

                    # Determine if the player ended on the right edge.
                    elif current_sequence < 39:

                        # Move the player to Go and collect 200.
                        self.player["sequence"] = 0
                        self.move_player()
                        self.process_property()

                        # Move the player to the lobby of the Jail.
                        self.player["sequence"] = 10
                        self.move_player()

                        # Move the player to Free Parking
                        self.player["sequence"] = 20
                        self.move_player()

                        # Move the player to Go To Jail
                        self.player["sequence"] = 30
                        self.move_player()

                        # Move the player to the top edge.
                        self.player["sequence"] = current_sequence
                        self.move_player()
                        self.move_message()

            # Determine if the player started on the bottom edge.
            elif self.current_sequence < 11:

                # Determine if the player ended on the bottom edge:
                if current_sequence < 11:

                    # Move the player along the botton edge.
                    self.move_player()
                    self.move_message()

                # Determine if the player ended on the left edge.
                elif current_sequence < 21:

                    # Move the player to the lobby of the Jail.
                    player["sequence"] = 10
                    self.move_player()

                    # Move the player along the left edge.
                    player["sequence"] = current_sequence
                    self.move_player()
                    self.move_message()

                # Determine if the player ended on the top edge.
                elif current_sequence < 31:

                    # Move the player to the lobby of the Jail.
                    player["sequence"] = 10
                    self.move_player()

                    # Move the player to the Free Parking.
                    player["sequence"] = 20
                    self.move_player()

                    # Move the player along the left edge.
                    player["sequence"] = current_sequence
                    self.move_player()
                    self.move_message()

                # Determine if the player ended on the right edge.
                elif current_sequence <= 39:

                    # Move the player to the lobby of the Jail.
                    player["sequence"] = 10
                    self.move_player()

                    # Move the player to the Free Parking.
                    player["sequence"] = 20
                    self.move_player()

                    # Move the player to Go To Jail.
                    player["sequence"] = 30
                    self.move_player()

                    # Move the player along the left edge.
                    player["sequence"] = current_sequence
                    self.move_player()
                    self.move_message()

            # Determine if the player started on the left edge.
            elif self.current_sequence < 21:

                # Determine if the player ended on the left edge:
                if current_sequence < 21:

                    # Move the player along the botton edge.
                    self.move_player()
                    self.move_message()

                # Determine if the player ended on the top edge.
                elif current_sequence < 31:

                    # Move the player to Free Parking
                    player["sequence"] = 20
                    self.move_player()

                    # Move the player along the left edge.
                    player["sequence"] = current_sequence
                    self.move_player()
                    self.move_message()

                # Determine if the player ended on the right edge.
                elif current_sequence <= 39:

                    # Move the player to the Free Parking.
                    player["sequence"] = 20
                    self.move_player()

                    # Move the player to Go To Jail.
                    player["sequence"] = 30
                    self.move_player()

                    # Move the player along the left edge.
                    player["sequence"] = current_sequence
                    self.move_player()
                    self.move_message()

            # Determine if the player started on the top edge.
            elif self.current_sequence < 31:

                # Determine if the player ended on the left edge:
                if current_sequence < 31:

                    # Move the player along the botton edge.
                    self.move_player()
                    self.move_message()

                # Determine if the player ended on the right edge.
                elif current_sequence <= 39:

                    # Move the player to Go To Jail.
                    player["sequence"] = 30
                    self.move_player()

                    # Move the player along the left edge.
                    player["sequence"] = current_sequence
                    self.move_player()
                    self.move_message()

            # Determine if the player started on the right edge.
            elif self.current_sequence <= 39:

                # Determine if the player ended on the right edge:
                if current_sequence <= 39:

                    # Move the player along the botton edge.
                    self.move_player()
                    self.move_message()

            # Process the property where the the player finally ended.
            self.process_property()

            # Determine if this function was called from an API call.
            if api == True:

                # Format a pass response.
                self.status = "Pass"
                self.object = {"player": self.player}
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Error: Monopoly.py: Monopoly: move_player_multiple_times")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def get_community_chest(self, api=False):

        try:

            # Determine if this function was called from an API call.
            if api == True:

                # Format and return a response suitable for a browser.
                self.status = "Pass"
                self.object = {"community_chest": copy.deepcopy(self.community_chest)}
                return self.format_response()

            else:

                # Return a reference to the Community Chest.
                return self.community_chest

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: get_community_chest")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def get_chance(self, api=False):

        try:

            # Determine if this function was called from an API call.
            if api == True:

                # Format and return a response suitable for a browser.
                self.status = "Pass"
                self.object = {"chance": copy.deepcopy(self.chance)}
                return self.format_response()

            else:

                # Return a reference to Chance.
                return self.chance

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: get_chance")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def log_message(self, api=False):

        try:
            # Log the message.
            timestamp = datetime.datetime.now().isoformat()
            formatted_message = "{} Game {}, Player {}: {}.".format(timestamp, self.game_key, self.player_name, self.message)
            print("\n" + formatted_message)

            # Determine if this function was called from an API call.
            if api == True:

                # Return a pass response.
                self.status = "Pass"
                self.object = {"message": copy.copy(formatted_message)}
                self.format_response()

        except Exception as e:

            print("\n**********")
            print("Error: Monopoly.py: Monopoly: log_message")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def send_message_to_a_player(self, player_key=None, api=False):

        try:

            if player_key is None: player_key = self.player_key

            # Define a transaction to send the message to all players.
            transaction = {}
            transaction["timestamp"] = datetime.datetime.now().isoformat()
            transaction["action"] = "Display Message"

            # Define the details.
            details = {}
            details["message"] = self.message

            # Add details to the transaction.
            transaction["details"] = details

            # Add the transaction to the queue of the player.
            self.players[player_key]["queue"].append(copy.deepcopy(transaction))

            # Determine if this function was called from an API call.
            if api == True:

                # Return a pass response.
                self.status = "Pass"
                self.object = {"player_name": self.players[player_key]["name"], "message": copy.copy(self.message)}
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Error: Monopoly.py: Monopoly: send_message_to_a_player")
            print("Exception: " + str(e))
            print("**********")
            raise Exception("Exception occurred in send_message_to_a_player.")

    def send_message_to_all_players(self, api=False):

        try:
            # Loop through all player keys.
            for player_key in self.players.keys():

                # Add the transaction to the queue of the next player.
                self.send_message_to_a_player(player_key=player_key)

            # Determine if this function was called from an API call.
            if api == True:

                # Return a pass response.
                self.status = "Pass"
                self.object = {"player_name": "All players.", "message": copy.copy(self.message)}
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Error: Monopoly.py: Monopoly: send_message_to_all_players")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def send_buttons_to_a_player(self, api=False):

        try:
            # Define a transaction to send the buttons to all players.
            transaction = {}
            transaction["timestamp"] = datetime.datetime.now().isoformat()
            transaction["action"] = "Display Buttons"

            # Define the details.
            details = {}
            details["buttons"] = self.buttons

            # Add details to the transaction.
            transaction["details"] = details

            # Add the transaction to the queue of the player.
            self.player["queue"].append(copy.deepcopy(transaction))

            # Determine if this function was called from an API call.
            if api == True:

                # Return a pass response.
                self.status = "Pass"
                self.object = {"player_name": self.player["name"], "buttons": copy.copy(self.buttons)}
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Error: Monopoly.py: Monopoly: send_buttons_to_a_player")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def send_command_to_a_player(self, player_key=None, api=False):

        try:
            if player_key is None: player_key = self.player_key

            # Define a transaction to send the buttons to all players.
            transaction = {}
            transaction["timestamp"] = datetime.datetime.now().isoformat()
            transaction["action"] = "Execute Command"

            # Add details to the transaction.
            transaction["details"] = self.command_details

            # Add the transaction to the queue of the player.
            self.players[player_key]["queue"].append(copy.deepcopy(transaction))

            # Determine if this function was called from an API call.
            if api == True:

                # Return a pass response.
                self.status = "Pass"
                self.object = {"player_name": self.players[player_key]["name"], "command_details": self.command_details}
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Error: Monopoly.py: Monopoly: send_command_to_a_player")
            print("Exception: " + str(e))
            print("**********")
            raise Exception("Exception occurred in send_command_to_a_player")

    def send_command_to_all_players(self, api=False):

        try:
            # Loop through all players.
            for player_key in self.players.keys():

                # Add the command to the queue of the next player.  True indicates that an error was encounterd.
                self.send_command_to_a_player(player_key=player_key)


            # Determine if this function was called from an API call.
            if api == True:

                # Return a pass response.
                self.status = "Pass"
                self.object = {"player_name": "All players", "command_details": self.command_details}
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Error: Monopoly.py: Monopoly: send_command_to_all_players")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def get_and_clear_queue(self, api=False):

        try:
            # Get a copy of the queue of a player.
            self.object = copy.deepcopy(self.player["queue"])

            # Clear the queue.
            self.player["queue"].clear()

            # Determine if this function was called from an API call.
            if api == True:

                # Format pass response.
                self.status = "Pass"

                # Return the response with the copy of the queue of a player.
                return self.format_response()

            else:

                # Return the queue.
                return self.object

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: get_and_clear_queue")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def get_player(self, api=False):

        try:
            # Return a response with a copy of the player.
            self.object = copy.deepcopy(self.player)

            # Determine if this function was called from an API call.
            if api == True:

                # Return a response suitable for a browser.
                self.status = "Pass"
                return self.response

            else:

                # Return the player.
                return self.player

        except Exception as e:

            print("\n**********")
            print("Error: Monopoly.py: Monopoly: get_player")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def get_players(self, api=False):

        try:
            # Get a copy of the players dictionary.
            self.object = copy.deepcopy(self.players)

            # Determine if this function was called from an API call.
            if api == True:

                # Format a response.
                self.status = "Pass"

                # Return a response suitable for a browser.
                return self.format_response()

            else:

                # Return the players.
                return self.players

        except Exception as e:

            print("\n**********")
            print("Error: Monopoly.py: Monopoly: get_players")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def get_player_net_worth(self, api=False):

        try:
            # Begin the net work with the cash owned by by the player.
            self.player["net_worth"] = self.player["balance"]

            # Loop through the keys of the properties owned by the player.
            for property_key in self.player["property_keys"]:

                # Get a property owned by the player.
                property = self.properties[property_key]

                # Verify that the property is not mortgaged.
                if property["mortgaged"] == True:
                    continue

                # Add the mortgage value of the Properth to the net worth of the player.
                self.player["net_worth"] += property["mortgage"]

                # TODO: If there are hotels, add selling value of hotels.
                # TODO: If there are houses, add selling value of houses.

            # Determine if this function was called from an API call.
            if api == True:

                # Return a response with a copy of the net worth of the player.
                self.status = "Pass"
                self.object = {}
                self.object["player_name"] = self.player["name"]
                self.object["net_worth"] = self.player["net_worth"]
                return self.format_response()

            else:

                # Return the players net worth.
                return self.player["net_worth"]

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: get_player_net_worth")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def get_property(self, api=False):

        try:

            # Determine if this function was called from an API call.
            if api == True:

                # Return a copy of the property.
                self.status = "Pass"
                self.object = copy.deepcopy(self.property)
                return self.format_response()

            else:

                # Return a reference to the property.
                return self.property

        except Exception as e:

            print("\n**********")
            print("Error: Monopoly.py: Monopoly: get_property")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def get_properties(self, api=False):

        try:
            # Return a copy of the property.
            self.status = "Pass"
            self.object = copy.deepcopy(self.properties)
            self.format_response()

            # Determine if this function was called from an API call.
            if api == True:

                # Return a response suitable for a browser.
                return self.response

            else:

                # Return a reference to the properties.
                return self.properties

        except Exception as e:

            print("\n**********")
            print("Error: Monopoly.py: Monopoly: get_properties")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def build_house_or_hotel(self, api=False):

        try:
            # Initialize the message, also used as a flag.
            self.message = None

            # The eligibile_for_sale indicates that the number of buildings on the property equals
            # the maximum number of buildings in the color group.  Must build evenly, so on a property
            # with less than the maximum.
            response = self.maximum_number_of_houses_or_hotel_in_color_group()

            # None and True indicate an error was encountered.
            if response is None:
                raise Exception("None returned by maximum_number_of_houses_or_totel_in_color_group.")

            # Extract if the property is eligible for sale from the response.
            eligible_for_sale = response["eligible_for_sale"]

            # Determine if the player owns this property.
            if self.property_key not in player["property_keys"]:

                # Notify the player that they cannot build on property they do not own.
                self.message = "You cannot build a house on property that you do not own."

            # Verify that the property can contain houses or a hotel.
            elif property["type"] != "property":

                # Notify the player that they cannot build on this kind of property.
                self.message = "You cannot build a house on property that cannot be developed."

            # Determine if the player owns the color group.
            elif self.player_owns_color_group() == False:

                # Notify the player that they need to own the entire color group before building.
                self.message = "You cannot build a house until you own the entire color group."

            # The True eligible_for_sale indicates the number of buildings on this property is the same as the maximum buildins on a property in the color group.
            elif eligible_for_sale == True:

                # Notify player that they to build evenly.
                self.message = "You must build houses or hotels evenly."

            # Verify that the property can be developed.
            elif self.property["hotels"] > 0:

                # Notify player that there is a hotel on the property and no further building can be done.
                self.message = "You cannot build, the property already has a hotel."

            # A message was found.  Short circuit the function.
            if self.message != None:

                # Send the message to the player.
                self.send_message_to_a_player()

                # Determine if this function was called from an API call.
                if api == True:

                    # Format the response.
                    self.status = "Pass"
                    self.object = {"message": copy.copy(self.message)}
                    return self.format_response()

                # A message indicates that a build could be done.
                return

            # Subtract the building cost from the balance of the player.
            self.player["balance"] -= self.property["building_cost"]

            # Update the balance of the player in the games of all other players.
            self.update_player_balance()

            # Increment the number of houses.
            if self.property["houses"] < 4:

                # Update properties and unhide house icons.
                if self.property["houses"] == 0:
                    self.building_id = self.property_key + "_house_1"
                    self.property["houses"] = 1

                elif self.property["houses"] == 1:
                    self.building_id = self.property_key + "_house_2"
                    self.property["houses"] = 2

                elif self.property["houses"] == 2:
                    self.building_id = self.property_key + "_house_3"
                    self.property["houses"] = 3

                elif self.property["houses"] == 3:
                    self.building_id = self.property_key + "_house_4"
                    self.property["houses"] = 4

                # Unide the house icon.
                self.unhide_house_or_hotel()

                # Format the message that a house was built.
                self.message = "House {:n} was built on {}.".format(self.property["houses"], self.property["name"])

                # Send the message to all players.
                self.send_message_to_all_players()

                # Display buttons.
                self.determine_buttons_to_be_displayed()

                # Determine if this function was called from an API call.
                if api == True:

                    # Format the response.
                    self.status = "Pass"
                    self.object = {"message": copy.copy(self.message)}
                    return self.format_response()

                # Finshed building a house.
                return

            # There are four houses.  Build and unhide hotel.  Hide houses.
            self.property["hotels"] = 1
            self.property["houses"] = 0

            # Get the identifier for the hotel icon.
            self.building_id = self.property_key + "_hotel"

            # Unide the house icon.  Return True if not successful.
            self.unhide_house_or_hotel()

            # Format the message indicating that a hotel was built.
            self.message = "A hotel was built on {}.".format(self.property["name"])

            # Send the message to the player.  True indicates and error was encountered.
            self.send_message_to_all_players()

            # Hide houses.
            for i in range(1, 5):

                # Format the building identifier for the next house.
                self.building_id = self.property_key + "_house_" + str(i)

                # Hide the house icon.
                self.hide_house_or_hotel()

            # Display buttons.
            self.determine_buttons_to_be_displayed()

            # Determine if this function was called from an API call.
            if api == True:

                # Format the response.
                self.status = "Pass"
                self.object = {"message": copy.copy(self.message)}
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Error: Monopoly.py: Monopoly: build_house_or_hotel")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def build_houses_or_hotels(self, api=False):

        try:
            # Build while the player has sufficient funds.
            while self.player["balance"] > 200:

                # Get the current number of houses and hotels in the color group.
                response = self.maximum_number_of_houses_or_hotel_in_color_group()

                # None and True indicate an error was encountered.
                if response is None:
                    raise Exception("None was returned by maximum_number_of_houses_or_hotel_in_color_group.")

                # Get the number of houses before building.  Used for loop control.
                previous_number_of_houses = response["houses"]

                # Get the number of hotels before building.  Used for loop control.
                previous_number_of_hotels = response["hotels"]

                # Attemp to build on every property owned by the player.
                for property_key in self.player["property_keys"]:

                    # Build house or hotel.
                    self.build_house_or_hotel()

                    # Verify that there are sufficient funds.
                    if player["balance"] <= 200:
                        break

                # Get the current number of houses and hotels in the color group.
                response = self.maximum_number_of_houses_or_hotel_in_color_group()

                # None and True indicate an error was encountered.
                if response is None:
                    raise Exception("None was returned by maximum_number_of_houses_or_hotel_in_color_group.")

                # The number of houses after the build.
                number_of_houses = response["houses"]

                # The number of hotels after the build.
                number_of_hotels = response["hotels"]

                # Determine if nothing was built.
                if number_of_houses == previous_number_of_houses and number_of_hotels == previous_number_of_hotels:

                    # Nothing was built.
                    break

            # Determine if this function was called from an API call.
            if api == True:

                # Format a pass response.
                self.status = "Pass"
                self.object = {"player": copy.deepcopy(self.player)}
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Error: Monopoly.py: Monopoly: build_houses_or_hotels")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def determine_buttons_to_be_displayed(self, api=False):

        try:
            # Initialize message, and buttons.
            self.message = None
            self.buttons = None

            # Determine if the player is bankrupt.
            if self.player["bankrupt"]:

                # Format a friendly message.
                self.message = "You are bankrupt.  Relax.  Watch the game finish."

                # The player can do nothing.
                self.buttons = ["End Game"]

            # Determine if the player is in jail.
            elif self.player["jail"] == True:

                # Determine if the player has a get-out-of-jail-card.
                if self.player["cards"] > 0:

                    # Inform the player that a card could be used.
                    self.message = "Pay, Roll Doubles or Use Card to get out of jail."

                    # Give the player the option to use the card.
                    self.buttons = ["Pay", "Roll", "Use Card", "End Game"]

                else:

                    # Inform the player to either roll doubles or pay the fine.
                    self.message = "Pay or Roll Doubles to get out of jail."

                    # Give the player the option to pay or roll the dice, hoping for doubles.
                    self.buttons = ["Pay", "Roll", "End Game"]

            # Determine if there is a payment due.
            elif self.payment > 0:

                # Determine if the player is bankrupt.
                if self.payment > self.get_player_net_worth():

                    # The player is bankrupt.
                    self.bankrupt_player()

                    # Format a friendly message.
                    self.message = "You are bankrupt.  Relax.  Watch the game finish."

                    # The player no longer has options.
                    self.buttons = ["End Game"]

                # Determine if the player has sufficient funds.
                elif self.player["balance"] > self.payment:

                    # Format message indicating what payment is to be paid.
                    self.message = "Make payment of {:n}.".format(self.payment)

                    # The player must pay.
                    self.buttons = ["Pay", "End Game"]

                else:

                    # Format message indicating insufficient funds.
                    self.message = "You have insufficient funds for payment of {:n}.".format(self.payment)

                    # The player must pay.
                    self.buttons = ["Sell", "Mortgage", "End Game"]

            # Determine if there is a collection due.
            elif self.collection > 0:

                # Format message indicating what payment is to be paid.
                self.message = "Make collection of {:n}.".format(self.payment)

                # The player must collect.
                self.buttons = ["Collect", "End Game"]

            else:

                # Determine if the player rolled doubles.
                if self.player["doubles"] > 0:

                    self.message = "You rolled doubles.  You can roll again or take an action."

                    # The player can roll again.
                    self.buttons = ["Roll", "Trade", "Mortgage", "Unmortgage", "Build", "Sell", "End Game"]

                else:

                    self.message = "Either select an action or end your turn."

                    # The player must end their turn.
                    self.buttons = ["End Turn", "Trade", "Mortgage", "Unmortgage", "Build", "Sell", "End Game"]

            # Send command, message, and buttons to the player.
            if self.message != None: send_message_to_a_player()
            if self.buttons != None: send_buttons_to_a_player()

            # Determine if this function was called from an API call.
            if api == True:

                # Format a pass response.
                self.status = "Pass"
                self.object = {}
                self.object["player_name"] = self.player["name"]
                self.object["message"] = self.message
                self.object["buttons"] = self.buttons
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Error: Monopoly.py: Monopoly: determine_buttons_to_be_displayed.")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def sell_house_or_hotel(self, api=False):

        try:
            # Initialize command, message, and buttons.
            self.command = None
            self.message = None
            self.buttons = None

            # Get the maximum number of houses and maximum number of hotels in the color group.
            response = self.maximum_number_of_houses_or_hotel_in_color_group()

            # None and True indicate that an error occurred.
            if response is None:
                raise Exception("None was returned by maximum_number_of_houses_or_hotel_in_color_group.")

            # Extract the maximum number of houses and hotels from the response.
            maximum_number_of_houses = response["houses"]
            maximum_number_of_hotels = response["hotels"]
            eligible_for_sale = response["eligible_for_sale"]

            # Determine if the player owns this property.
            if self.property_key not in player["property_keys"]:

                # Notify the player that they cannot sell a house on property that they do not own.
                self.message = "You cannot sell a building on property that you do not own."

            # Verify that the property can contain houses or a hotel.
            elif self.property["type"] != "property":

                # Notify the player that they cannot sell buildings from a property that cannot have a building.
                self.message = "You cannot sell a building on property that cannot be developed."

            # Determine that the number of buildings on this property is equal to the maximum number of buildings on a property in the color group.
            elif response["eligible_for_sale"] == False:

                # Notify the player that must sell houses or hotels evenly.
                self.message = "You must sell houses or hotels evenly."

            # Determine if a condition that prevents a sale was found.
            if self.message != None:

                # Send the message to the player.
                self.send_message_to_a_player()

                # Determine if this function was called from an API call.
                if api == True:

                    # Format a pass response.
                    self.status = "Pass"
                    self.object = {"message": self.message}
                    return self.format_response()

                # A message indicates a building could not be sold.
                return

            # Add the selling value for a single building to the balance of the player.
            self.player["balance"] += self.property["building_cost"] * 0.5

            # Update the balance on the boards of the other players.
            self.update_player_balance()

            # Determine that there are no hotels.
            if self.property["hotels"] == 0:

                # Update properties and hide house icons.
                if self.property["houses"] == 1:
                    self.building_id = self.property_key + "_house_1"
                    self.property["houses"] = 0

                elif self.property["houses"] == 2:
                    self.building_id = self.property_key + "_house_2"
                    self.property["houses"] = 1

                elif self.property["houses"] == 3:
                    self.building_id = self.property_key + "_house_3"
                    self.property["houses"] = 3

                elif self.property["houses"] == 4:
                    self.building_id = self.property_key + "_house_4"
                    self.property["houses"] = 3

                # Hide the house icon.
                self.hide_house_or_hotel()

                # Notify player that a house was sold.
                self.message = "House {:n} on {} was sold.".format((self.property["houses"] - 1), self.property["name"])

                # Notify the player.
                self.send_message_to_all_players()

                # Display buttons.
                self.determine_buttons_to_be_displayed()

                # Determine if this function was called from an API call.
                if api == True:

                    # Format a pass response.
                    self.status = "Pass"
                    self.object = {"message": self.message}
                    return self.format_response()

                # Done with selling houses.
                return

            # Update the property to indicate that there are no hotels and four houses.
            self.property["hotels"] = 0
            self.property["houses"] = 4

            # Get the identifier for the hotel icon.
            self.building_id = self.property_key + "_hotel"

            # Hide the hotel icon.
            self.hide_house_or_hotel()

            # Unhide houses.
            for i in range(1, 5):

                # Format the building identifier for the next house.
                self.building_id = self.property_key + "_house_" + str(i)

                # Unhide the house.
                self.unhide_house_or_hotel()

            # Format the message that indicates that the hotel was sold.
            self.message = "Hotel on {} was sold.".format(self.property["name"])

            # Send the message to the player.
            self.send_message_to_all_players()

            # Display buttons.
            self.determine_buttons_to_be_displayed()

            # Determine if this function was called from an API call.
            if api == True:

                # Format a pass response.
                self.status = "Pass"
                self.object = {"message": self.message}
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Error: Monopoly.py: Monopoly: sell_house_or_hotel")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def sell_houses_or_hotels(self, api=False):

        try:
            # Loop through the keys of the properties owned by the player.
            for property_key in self.player["property_keys"]:

                # Set the instance variable for the property key.
                self.property_key = property_key

                # Sell the house or hotel.
                self.sell_house_or_hotel()

                # Test if sufficient number of houses and hotels have been sold.
                if self.player["balance"] > self.payment:
                    break

            # Determine if this function was called from an API call.
            if api == True:

                # Format a successful response.
                self.status = "Pass"
                self.object = None
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Error: Monopoly.py: Monopoly: sell_houses_or_hotels")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def mortgage_property(self, api=False):

        try:
            # Get references to the property.
            self.property = self.properties[self.property_key]
            self.property_name = self.propert["name"]
            self.property_owner_key = self.property["owner_key"]
            self.property_mortgage = self.property["mortgage"]
            self.property_mortgaged = self.property["mortgaged"]

            # Initialize message.
            self.message = None

            # Player cannot mortgage properthy that they do not own.
            if self.player_key != self.property_owner_key:

                # Notify the player that the property is not theirs.
                self.message = "{} cannot be mortgaged because you do not own it.".format(self.property_name)

            # Property is already mortgaged.
            if self.property_mortgaged:

                # Notify the player that the property is already mortgaged.
                self.message = "{} cannot be mortgaged because it was already mortgaged.".format(self.property_name)

            # Determine if the property can have hotels.
            elif "hotels" in self.property.keys():

                # Determine if the property has a hotel.
                if self.property["hotels"] > 0:

                    # Notify the player that a developed property cannot be mortgaged.
                    self.message = "{} cannot be mortgaged because it has a hotel.".format(self.property_name)

            # Determine if the property can have houses.
            elif "houses" in property.keys():

                # Determine if the properrty has a house.
                if self.property["houses"] > 0:

                    # Notify the player that a developed property cannot be mortgaged.
                    self.message = "{} cannot be mortgaged because it has a house.".format(self.property_name)

            # Determine if there is a message indicating that the mortgage cannot be made.
            if self.message != None:

                # Send the 
                self.send_message_to_a_player()

                # Determine the buttons to be displayed.
                self.determine_buttons_to_be_displayed()

                # Determine if this function was called from an API call.
                if api == True:

                    # Format a pass response.
                    self.status = "Pass"
                    self.object = {"message": self.message}
                    return self.format_response()

            # Mortgage the property.
            self.property_mortgaged = True

            # Update the mortgaged attribute of the property in the games of all players.
            self.update_property_mortgaged()

            # Update the mortgaged attribute of the class of the property icon on the boards of all players.
            self.update_property_icon_class()

            # Add the mortgage value to the balance of the bot.
            self.player["balance"] += self.property_mortgage

            # Update the balance of the player in the games of all players.
            self.update_player_balance()

            # Format message.
            self.message = "{} was mortgaged.".format(self.property_name)

            # Send the message to all players.
            self.send_message_to_all_players()

            # Determine the buttons to be displayed.
            self.determine_buttons_to_be_displayed()

            # Determine if this function was called from an API call.
            if api == True:

                # Return a pass response.
                self.status = "Pass"
                self.object = None
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: mortgage_property")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def mortgage_properties(self, api=False):

        try:
            # Mortgage each property owned by the bot until the balances is sufficient to make the payment.
            for property_key in self.player["property_keys"]:

                # Set the global reference to the property key.
                self.property_key = property_key

                # Get a reference to the next property.
                self.property = self.properties[self.property_key]

                # Mortgage the property.
                self.mortgage_property()

                # Stop mortgaging properties if the balance is sufficient to make the payment.
                if self.player["balance"] > self.payment:
                    break

            # Determine if this function was called from an API call.
            if api == True:

                # Format and return a successful response.
                self.status = "Pass"
                self.object = None
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: mortgage_properties")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def unmortgage_property(self, api=False):

        try:
            # Get references to the property.
            property = self.properties[self.property_key]
            property_name = self.property["name"]
            property_owner_key = self.property["owner_key"]
            property_mortgaged = self.property["mortgaged"]
            property_mortgage = self.property["mortgage"]


            # Initialize message.
            self.message = None

            # Determine if the player owns the property.
            if self.player_key == property_owner_key:

                # Determine if the property is mortgaged and the financial requirement to unmortgage is met.
                if property_mortgaged:

                    # Get the balance of the player.
                    balance = self.player["balance"]

                    # Calculate the financial requirement.
                    financial_requirement = int(property_mortgage * 2)

                    if balance > financial_requirement:

                        # Pay back the mortgage to the bank plus ten percent.
                        payment = int(property_mortgage * 1.1)

                        # Subtract the payment from the balance of the player.
                        balance -= payment

                        # Update the balance of the player in the games of all players.
                        self.update_player_balance()

                        # Unmortgage the property.
                        property_mortgaged = False

                        # Update the mortgaged attribute of the class of the property icon.
                        self.update_property_icon_class()

                        # Format a message to indicate that the property was unmortgaged.
                        self.message = "{} was unmortgaged for {:n}.".format(self.property["name"], payment)

                    else:

                        # Format a message that there insufficient funds to unmortgage the property.
                        self.message = "{} was not unmortgaged for insufficient funds.".format(self.property["name"])

                else:

                    # Format a message that the property is not mortgaged.
                    self.message = "{} was not unmortgaged because it was not mortgaged.".format(self.property["name"])

            else:

                # Format a message that the property is not owned by the player.
                self.message = "{} was not unmortgaged because you do not own it.".format(self.property["name"])

            # Send the message to the player.
            self.send_message_to_a_player()

            # Display buttons.
            self.determine_buttons_to_be_displayed()

            # Determine if this function was called from an API call.
            if api == True:

                # Format a successful response.
                self.status = "Pass"
                self.object = None
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: unmortgage_property")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def unmortgage_properties(self, api=False):

        try:
            # Loop through each property owned by the player.
            for property_key in self.player["property_keys"]:

                # Set the global property key.
                self.property_key = property_key

                # Unmortgage the property.
                self.unmortgage_property()

                # Test if the payment is met.
                if self.player["balance"] > self.payment:
                    break

            # Determine if this function was called from an API call.
            if api == True:

                # Format a pass response.
                self.status = "Pass"
                self.object = None
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: unmortgage_properties")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def process_property(self, api=False):

        try:
            # Initialize message and buttons.
            self.message = None
            self.buttons = None

            # Search the properties in this game.
            for property_key in self.properties.keys():

                # Determine if this property is where the player is located.
                if property_key == self.player["sequence"]:

                    # Get a reference to the property where the player is located.
                    self.property_key = property_key
                    self.property = self.properties[property_key]
                    self.property_type = self.property["type"]
                    self.property_name = self.property["name"]
                    if "owner_key" in self.property.keys():
                        self.property_owner_key = self.property["owner_key"]
                        self.property_owner = self.players[self.property_owner_key]
                        self.property_owner_name = self.property_owner["name"]
                    else:
                        self.property_owner_key = None
                        self.property_owner = None
                        self.property_owner_name = None
                    break
                    self.property_can_be_owned_by_a_player = any([self.property_type == "property", self.property_type == "railroad", self.property_type == "utility"])

            # Determine if this property can be owned by a player and the property is owned by the bank.
            if self.property_can_be_owned_by_a_player and self.property_owner == 0:

                # Determine if the player can buy the property.
                if self.property["price"] > self.get_player_net_worth():

                    # Player must start an auction.
                    self.message = "You cannot afford {}.  Make a bid or fold.".format(self.property_name)

                    # Display the Auction Button.  When the client sees the Bid Button, the client unhides the Auction Screen.
                    self.buttons = ["Bid", "Fold", "End Game"]

                else:

                    # Player can afford the property.  They must buy the property or start an auction.
                    self.message = "Either buy {}, make a bid, or fold.".format(self.property_name)

                    # Display the Buy Button and Auction Button.  The Pay button will take care of selling and mortgaging.
                    self.buttons = ["Buy", "Bid", "Fold", "Sell", "Mortgage", "End Game"]

            # Determine if the player already owns the the property.
            elif self.player_key == self.property_owner_key:

                # The player already owns the property.
                self.message = "You already own {}.".format(self.property_name)

            # Determine if the property is type property.
            elif self.property_type == "property":

                # Process the property sequence.
                self.process_property_type_property()

            # Determine if the property is type railroad.
            elif self.property_type == "railroad":

                # Process the property sequence.
                self.process_property_type_railroad()

            # Determine if the property is type utility.
            elif self.property_type == "utility":

                # Process the property sequence.
                self.process_property_type_utility()

            # Determine if the property is the Go sequence.
            elif self.property_type == "go":

                # Process the Go sequence.
                self.process_property_type_go()

            # Determine if the property is the Jail sequence.
            elif self.property_type == "jail":

                # Process the Go sequence.
                self.process_property_type_jail()

            # Determine if the property is the Free Parking sequence.
            elif self.property_type == "free_parking":

                # Process the Go sequence.
                self.process_property_type_free_parking()

            # Determine if the property is the Go To Jail sequence.
            elif self.property_type == "go_to_jail":

                # Process the Go sequence.
                self.process_property_type_go_to_jail()

            # Determine if the property is Community Chest.
            elif self.property_type == "community_chest":

                # Process the next Community Chest card.
                self.process_property_type_community_chest()

            # Determine if the property is Chance.
            elif self.property_type == "chance":

                # Process the next Chance card.
                self.process_property_type_chance()

            # Determine if the property is a type tax.
            elif self.property_type == "tax":

                # Player must pay the tax.
                self.process_property_type_tax()

            # Determine if the player can make a collection.
            if self.collection > 0:

                # Format message indicating what salary to collect.
                self.message = "Receive collection of {:n}.".format(self.payment)

                # The player must pay.
                self.buttons = ["Collect", "End Game"]

            # Determine if the player can make the payment.
            if self.payment > self.get_player_net_worth():

                # The player cannot make the payment and is now bankrupt.
                self.bankrupt_the_player()

            else:

                # Determine if the player has sufficient funds.
                if self.player["balance"] > self.payment:

                    # Format message indicating what payment is to be paid.
                    self.message = "Make payment of {:n} for {}.".format(self.payment, self.property_name)

                    # The player must pay.
                    self.buttons = ["Pay", "End Game"]

                else:

                    # Format message indicating insufficient funds.
                    self.message = "You have insufficient funds for payment of {:n} for {}.".format(self.payment, self.property_name)

                    # The player must pay.
                    self.buttons = ["Sell", "Mortgage", "End Game"]

            # Determine if a message is to be sent to the player.
            if self.message != None:

                # Send the message to the player.
                self.send_message_to_a_player()

            # Determine if buttons are to be displayerd.
            if self.buttons != None:

                # Send buttons to be displayed to the player
                self.send_buttons_to_a_player()

            else:

                # Display buttons based on the current state of the player.
                self.determine_buttons_to_be_displayed()

            # Determine if this function was called from an API call.
            if api == True:

                # Format a pass response.
                self.status = "Pass"
                self.object = None
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: process_property")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def make_the_payment(self, api=False):

        try:
            # Initialize message.
            self.message = None
            self.buttons = None

            # Determine if the player is paying the fine to get out of jail.
            if self.player["jail"]:

                # Determine if the player is bankrupt.
                if self.get_player_net_worth() < 50:

                    # The player is bankrupt.
                    self.bankrupt_the_player()

                    # The player no longer has an option.
                    self.buttons = ["End Game"]

                # Determine if the player has the funds to pay the fine.
                elif self.player["balance"] < 50:

                    # Format message indicating insufficient funds.
                    self.message = "You have insufficient funds to pay for the fine."

                    # Determine if the player has a get-out-of-jail card.
                    if self.players["cards"] > 0:

                        # Give the player the option to use a card.
                        self.buttons = ["Roll", "Pay", "Use Card", "Sell", "Mortgage", "End Game"]

                    else:
                
                        # The player can either try rolling doubles or raising funds.
                        self.buttons = ["Roll", "Pay", "Sell", "Mortgage", "End Game"]

                else:

                    # The player pays the fine.
                    self.player["balance"] -= 50

                    # Update the balance of the player in the games of all players.
                    self.update_player_balance()

                    # Format the message that the fine was made.
                    self.message = "You paid the fine of {:n}.".format(self.payment)

                    # Send the message to the layer.
                    self.send_message_to_a_player()

                    # Move the player to the lobby of the jail.
                    self.get_player_out_of_jail()

            # Determine if the player is bankrupt.
            elif self.payment > self.get_player_net_worth():

                # The player is bankrupt.
                self.bankrupt_the_player()

                # The player no longer has an option.
                self.buttons = ["End Game"]

            # Determine if the player has sufficient funds to make the payment.
            elif self.player["balance"] > self.payment:

                # The player makes the payment.
                self.player["balance"] -= self.payment

                # Update the balance of the player in the games of all players.
                self.update_player_balance()

                # Set the global payment amount to zero after the payment was made.
                self.payment = 0

                # Format the message that the payment was made to the bank.
                self.message = "You made the payment of {:n}.".format(self.payment)

                # Send message to the player.
                self.send_message_to_a_player()

            else:

                # Format message indicating insufficient funds.
                self.message = "You have insufficient funds for payment of {:n} for {}.".format(self.payment, self.property_name)

                # The player must pay.
                self.buttons = ["Sell", "Mortgage", "End Game"]

            # Determine if a message is to be sent to the player.
            if self.message != None: 
                
                # Send the message to the player.
                self.send_message_to_a_player()

            # Determine if buttons are to be sent to the player.
            if self.buttons != None: 
                
                # Send buttons to the player.
                self.send_buttons_to_a_player()

            else:

                # Determine buttons to be displayed.
                self.determine_buttons_to_be_displayed()

            # Determine if this function was called from an API call.
            if api == True:

                # Format a pass response.
                self.status = "Pass"
                self.object = None
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: make_the_collection")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def make_the_collection(self, api=False):

        try:
            # Initialize message.
            self.message = None

            # The player makes the collection.
            self.player["balance"] += self.collection

            # Update the balance of the player in the games of all players.
            self.update_player_balance()

            # Reset the global collection.
            self.collection = 0

            # Format the message that the payment was made to the bank.
            self.message = "You made the collection of {:n}.".format(self.collection)

            # Send the message to the player.
            self.send_message_to_a_player()

            # Determine buttons to be displayed.
            self.determine_buttons_to_be_displayed()

            # Determine if this function was called from an API call.
            if api == True:

                # Format a pass response.
                self.status = "Pass"
                self.object = None
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: make_the_collection")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def process_property_type_property(self, api=False):

        try:

            # Determine the type of property is "property".
            if self.property_type != "property":

                # The property is not type "property".
                raise Exception('Attempting to process property {} that is not type "property".'.format(self.property_name))

            elif self.property["hotels"] > 0:

                # Extract the hotel rent from the property.
                self.payment = self.property["hotel_rent"]

            elif property["houses"] > 0:

                # Determine the index into the list of house rents.
                house_rent_index = self.property["houses"] - 1

                # Get the house rent from the list of house rents.
                self.payment = self.property["house_rents"][house_rent_index]

            elif self.player_owns_color_group(player_key=self.property_owner_key):

                # Get the house rent from the property.
                self.payment = self.property["rent"] * 2

            else:

                # Get the house rent from the property.
                self.payment = self.property["rent"]

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: process_property_type_property")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def process_property_type_railroad(self, property):

        try:
            # Define the counters of railroads owned by the property owner.
            number_of_railroads_owned = 0

            # Determine the type of property is "railroad".
            if self.property_type != "railroad":

                # The property is not type "property".
                raise Exception('Attempting to process property {} that is not type "railroad".'.format(self.property_name))

            # Determine the number of railroads owned by the owner of the current railroad.
            if self.properties[5]["owner_key"] == self.property_owner_key:
                number_of_railroads_owned += 1

            elif self.properties[15]["owner_key"] == self.property_owner_key:
                number_of_railroads_owned += 1

            elif self.properties[25]["owner_key"] == self.property_owner_key:
                number_of_railroads_owned += 1

            elif self.properties[35]["owner_key"] == self.property_owner_key:
                number_of_railroads_owned += 1

            # Calculate the global payment based on the number of railroads owned.
            if number_of_railroads_owned == 1:
                self.payment = 25
            elif number_of_railroads_owned == 2:
                self.payment = 50
            elif number_of_railroads_owned == 3:
                self.payment = 100
            else:
                self.payment = 200

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: process_property_type_rairoad")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def process_property_type_utility(self, property):

        try:
            # Define the counters of utilities owned by the property owner.
            number_of_utilities_owned = 0

            # Determine the type of property is "utility".
            if self.property_type != "utility":

                # The property is not type "property".
                raise Exception('Attempting to process property {} that is not type "utility".'.format(self.property_name))

            # Determine the number of railroads owned by the owner of the current railroad.
            if self.properties[12]["owner_key"] == self.property_owner_key:
                number_of_utilities_owned += 1

            elif self.properties[28]["owner_key"] == self.property_owner_key:
                number_of_utilities_owned += 1

            # Calculate the global payment based on the number of utilities owned.
            if number_of_utilities_owned == 1:
                self.payment = self.dice * 4
            else:
                self.payment = self.dice * 10

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: process_property_type_utility")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def process_property_type_go(self, api=False):

        try:
            # Determine the type of property is "go".
            if self.property_type != "go":

                # The property is not type "property".
                raise Exception('Attempting to process property {} that is not type "go".'.format(self.property_name))

            # Set the global collection to the salary.
            self.collection = self.property["salary"]

            # Determine if this is an API call.
            if api == True:

                # Return a pass response.
                self.status = "Pass"
                self.object = None
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: process_property_type_go")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def process_property_type_jail(self, api=False):

        try:
            # Determine the type of property is "jail".
            if self.property_type != "jail":

                # The property is not type "property".
                raise Exception('Attempting to process property {} that is not type "jail".'.format(self.property_name))

            # Inform the player.
            self.message = "Relax.  You are just visiting Erroll."

            # Determine if this is an API call.
            if api == True:

                # Return a pass response.
                self.status = "Pass"
                self.object = None
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: process_property_type_jail")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def process_property_type_free_parking(self, api=False):

        try:
            # Determine the type of property is "free_parking".
            if self.property_type != "free_parking":

                # The property is not type "property".
                raise Exception('Attempting to process property {} that is not type "free_parking".'.format(self.property_name))

            # Inform the player.
            self.message = "Relax.  You are parking for free."

            # Determine if this is an API call.
            if api == True:

                # Return a pass response.
                self.status = "Pass"
                self.object = None
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: process_property_type_free_parking")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def process_property_type_go_to_jail(self, api=False):

        try:
            # Determine the type of property is "go_to_jail".
            if self.property_type != "go_to_jail":

                # The property is not type "property".
                raise Exception('Attempting to process property {} that is not type "go_to_jail".'.format(self.property_name))

            # Move the player into jail and notify all players.
            self.move_player_into_jail()

            # Determine if this is an API call.
            if api == True:

                # Return a pass response.
                self.status = "Pass"
                self.object = None
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: process_property_type_go_to_jail")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def process_property_type_community_chest(self, api=False):

        try:
            # Determine the type of property is "community_chest".
            if self.property_type != "community_chest":

                # The property is not type "property".
                raise Exception('Attempting to process property {} that is not type "community_chest".'.format(self.property_name))

            # Preserve the current sequence to determine if the Community Chest card moved the player.
            self.previous_sequence = copy.copy(self.player["sequence"])

            # Process the next Chance card.
            self.community_chest.process_community_chest_event(self)

            # Determine if the Community Chest card moved the player.
            if self.player["sequence"] == self.previous_sequence:

                # The player did not move.
                pass

            else:
                # Move the player and process the property.
                self.move_player_multiple_times()

            # Determine if this is an API call.
            if api == True:

                # Return a pass response.
                self.status = "Pass"
                self.object = None
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Error: Monopoly.py: Monopoly: process_property_type_community_chest")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def process_property_type_chance(self, api=False):

        try:
            # Determine the type of property is "chance".
            if self.property_type != "chance":

                # The property is not type "property".
                raise Exception('Attempting to process property {} that is not type "chance".'.format(self.property_name))

            # Copy the sequence of the player to be used in multiple moves.
            self.previous_sequence = copy.copy(self.player["sequence"])

            # Process the next Chance card.
            self.chance.process_chance_event(self)

            # Determine if the Chance card moved the player.
            if self.player["sequence"] == self.previous_sequence:

                # The player did not move.
                pass

            else:
                # Move the player and process the property.
                self.move_player_multiple_times()

            # Determine if this is an API call.
            if api == True:

                # Return a pass response.
                self.status = "Pass"
                self.object = None
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Error: Monopoly.py: Monopoly: process_property_type_chance")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def process_property_type_tax(self, api=False):

        try:
            # Set the global payment to the tax.
            self.payment = self.property["tax"]

            # Determine if the function was called as an API.
            if api == True:

                # Return a pass response.
                self.status = "Pass"
                self.object = {"tax": self.payment}
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Error: Monopoly.py: Monopoly: process_property_type_tax")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def maximum_number_of_houses_or_hotel_in_color_group(self, api=False):

        try:
            # Determine if the property is in the Brown color group.
            # Mediterranean Avenue, Baltic Avenue
            if self.property_key in [1, 3]:

                # Determine the maximum number of hotels in the color group.
                a = properties[1]["hotels"]
                b = properties[3]["hotels"]
                c = properties[3]["hotels"]

                # Determine the maximum number of houses in the color group.
                d = properties[1]["houses"]
                e = properties[3]["houses"]
                f = properties[3]["houses"]

            # Determine if the property is in the LightBlue color group.
            # Oriental Avenue, Vermont Avenue, Connecticut Avenue
            elif self.property_key in [6, 8, 9]:

                # Determine the maximum number of hotels in the color group.
                a = properties[6]["hotels"]
                b = properties[8]["hotels"]
                c = properties[9]["hotels"]

                # Determine the maximum number of houses in the color group.
                d = properties[6]["houses"]
                e = properties[8]["houses"]
                f = properties[9]["houses"]

            # Determine if the property is in the Purple color group.
            # St. Charles Place, States Avenue, Virginia Avenue
            elif self.property_key in [11, 13, 14]:

                # Determine the maximum number of hotels in the color group.
                a = properties[11]["hotels"]
                b = properties[13]["hotels"]
                c = properties[14]["hotels"]

                # Determine the maximum number of houses in the color group.
                d = properties[11]["houses"]
                e = properties[13]["houses"]
                f = properties[14]["houses"]

            # Determine if the property is in the Orange color group.
            # St. James Place, Tennessee Avenue, New York Avenue
            elif self.property_key in [16, 18, 19]:

                # Determine the maximum number of hotels in the color group.
                a = properties[16]["hotels"]
                b = properties[18]["hotels"]
                c = properties[19]["hotels"]

                # Determine the maximum number of houses in the color group.
                d = properties[16]["houses"]
                e = properties[18]["houses"]
                f = properties[19]["houses"]

            # Determine if the property is in the Red color group.
            # Kentucky Avenue, Indiana Avenue, Illinois Avenue
            elif self.property_key in [21, 23, 334]:

                # Determine the maximum number of hotels in the color group.
                a = properties[21]["hotels"]
                b = properties[23]["hotels"]
                c = properties[24]["hotels"]

                # Determine the maximum number of houses in the color group.
                d = properties[21]["houses"]
                e = properties[23]["houses"]
                f = properties[24]["houses"]

            # Determine if the property is in the Yellow color group.
            # Atlantic Avenue, Ventnor Avenue, Marvin Gardens
            elif self.property_key in [26, 27, 29]:

                # Determine the maximum number of hotels in the color group.
                a = properties[26]["hotels"]
                b = properties[27]["hotels"]
                c = properties[29]["hotels"]

                # Determine the maximum number of houses in the color group.
                d = properties[26]["houses"]
                e = properties[27]["houses"]
                f = properties[29]["houses"]

            # Determine if the property is in the Green color group.
            # Pacific Avenue, North Carolina Avenue, Pennsylvania Avenue
            elif self.property_key in [31, 32, 34]:

                # Determine the maximum number of hotels in the color group.
                a = properties[31]["hotels"]
                b = properties[32]["hotels"]
                c = properties[34]["hotels"]

                # Determine the maximum number of houses in the color group.
                d = properties[31]["houses"]
                e = properties[32]["houses"]
                f = properties[34]["houses"]

            # Determine if the property is in the DarkBlue color group.
            # Park Place, Boardwark
            elif self.property_key in [37, 39]:

                # Determine the maximum number of hotels in the color group.
                a = properties[37]["hotels"]
                b = properties[39]["hotels"]
                c = properties[39]["hotels"]

                # Determine the maximum number of houses in the color group.
                d = properties[37]["houses"]
                e = properties[39]["houses"]
                f = properties[39]["houses"]

            # Define response
            self.status = "Pass"
            self.object = {}
            self.object["hotels"] = max([a, b, c])
            self.object["houses"] = max([d, e, f])

            # Determine if the player owns the color group.
            if self.player_owns_color_group() == False:

                # There is nothing to sell if the player does not own the color group.
                self.object["eligible_for_sale"] = False

            else:

                # Determine if the property can be sold if it has sufficient hotels.
                if property["hotels"] < self.object["hotels"]:

                    # The player cannot sell the hotel because the property does not have the maximum hotels of the color group.
                    self.object["eligible_for_sale"] = False

                # Determine if the property can be sold if it has sufficient houses.
                elif property["houses"] < self.object["houses"]:

                    # The player cannot sell a house because the property does not have the maximum houses of the color group.
                    self.object["eligible_for_sale"] = False

            # Format a response suitable for a browser.
            self.format_response()

            # Determine if the function was called as an API.
            if api == True:

                # Return the response suitable for a browser.
                return self.response

            else:

                # Return the object containing maximum number of houses, maximum number of hotels, and if the property is eligible for sale.
                return self.object

        except Exception as e:

            print("\n**********")
            print("Error: Monopoly.py: Monopoly: maximum_number_of_houses_or_hotel_in_color_group")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()

            # Determine if this is an API call.
            if api == True:

                # Return a response suitable for a browser.
                return self.set_error_encountered()

            else:

                # Issue the stop command to all players.
                self.set_error_encountered()

                # Return None to the calling function.
                return None

    def player_owns_color_group(self, player_key=None, api=False):

        try:
            if player_key is None: player_key = self.player_key

            # Get a reference to the key of the player argument.
            a = player_key

            # Determine if the color group is Brown.
            # Mediterranean Avenue, Baltic Avenue
            if self.property_key in [1, 3]:

                # Get the owners of the color group.
                b = properties[1]["owner"]
                c = properties[3]["owner"]
                d = properties[3]["owner"]

            # Determine if the color group is LightBlue.
            # Oriental Avenue, Vermonnt Avenue, Connecticut Avenue
            elif self.property_key in [6, 8, 9]:

                # Get the owners of the color group.
                b = properties[6]["owner"]
                c = properties[8]["owner"]
                d = properties[9]["owner"]

            # Determine if the color group is Purple.
            # St. Charles Place, States Avenue, Virginia Avenue
            elif self.property_key in [11, 13, 14]:

                # Get the owners of the color group.
                b = properties[11]["owner"]
                c = properties[13]["owner"]
                d = properties[14]["owner"]

            # Determine if the color group is Orange.
            # St. James Place, Tennessee Avenue, New York Avenue
            elif self.property_key in [16, 18, 19]:

                # Get the owners of the color group.
                b = properties[16]["owner"]
                c = properties[18]["owner"]
                d = properties[19]["owner"]

            # Determine if the color group is Red.
            # Kentucky Avenue, Indiana Avenue, Illinois Avenue
            elif self.property_key in [21, 23, 24]:

                # Get the owners of the color group.
                b = properties[21]["owner"]
                c = properties[23]["owner"]
                d = properties[24]["owner"]

            # Determine if the color group is Yellow.
            # Atlantic Avenue, Ventnor Avenue, Marvin Gardens
            elif self.property_key in [26, 27, 29]:

                # Get the owners of the color group.
                b = properties[26]["owner"]
                c = properties[27]["owner"]
                d = properties[29]["owner"]

            # Determine if the color group is Green.
            # Pacific Avenue, North Carolina Avenue, Pennsylvania Avenue
            elif self.property_key in [31, 32, 34]:

                # Get the owners of the color group.
                b = properties[31]["owner"]
                c = properties[32]["owner"]
                d = properties[34]["owner"]

            # Determine if the color group is Darkblue.
            # Park Place, Boardwalk
            elif self.property_key in [37, 39]:

                # Get the owners of the color group.
                b = properties[37]["owner"]
                c = properties[39]["owner"]
                d = properties[39]["owner"]

            else:
                # The property does not belong in a color group.
                raise Exception("Invalid property key.")

            # Format a response.
            self.status = "Pass"

            # Determine if the player is the owner of the color group.
            self.object = {"player_owns_color_group": all([(a == b), (a == c), (a == d)])}

            # Format a response suitable for a browser.
            self.format_response

            # Determine if the function was called as an API.
            if api == True:

                # Return the response suitable for a browser.
                return self.response

            else:

                # Return the Boolean indicating if the owner owns the color group.
                return self.object["player_owns_color_group"]

        except Exception as e:

            print("\n**********")
            print("Error: Monopoly.py: Monopoly: player_owns_color_group")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def update_player_balance(self, player_key=None, api=False):

        try:
            if player_key is None: player_key = self.player_key

            # Instruct the player to update the balance of the target player.
            self.command_details = {}
            self.command_details["command"] = "Update Player Balance"
            self.command_details["target_player_key"] = player_key
            self.command_details["balance"] = self.players[player_key]["balance"]

            # Send the instruction to all players.
            self.send_command_to_all_players()

            # Determine if the function was called as an API.
            if api == True:

                # Return a pass response.
                self.status = "Pass"
                self.object = {"command_details": self.command_details}
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: update_player_balance")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def update_property_owner(self, player_key=None, property_key=None, api=False):

        try:
            if player_key is None: player_key = self.player_key
            if property_key is None: property_key = self.property_key

            # Instruct a player to update the owner key of a property.
            self.details = {}
            self.command_details["command"] = "Update Property Owner"
            self.command_details["property_key"] = property_key
            self.command_details["owner_key"] = player_key

            # Send the instruction to all players.
            self.send_command_to_all_players()

            # Determine if this is an API call.
            if api == True:

                # Return a pass response.
                self.status = "Pass"
                self.object = {"command_details": self.command_details}
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: update_property_ownerr")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def hide_house_or_hotel(self, api=False):

        try:
            # Instruct a player to hide a house or hotel.
            self.command_details = {}
            self.command_details["command"] = "Hide House or Hotel"
            self.command_details["building_id"] = self.building_id

            # Send the instruction to all players.
            self.send_command_to_all_players()

            # Determine if the function was called as an API.
            if api == True:

                # Format a successful response.
                self.status = "Pass"
                self.object = {"command_details": self.command_details}
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: unhide_house_or_hotel.")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def unhide_house_or_hotel(self, api=False):

        try:
            # Instruct a playr to unhide a house or hotel.
            self.command_details = {}
            self.command_details = details["command"] = "Unhide House or Hotel"
            self.command_details["building_id"] = self.building_id

            # Send the instruction to all players.
            self.send_command_to_all_players()

            # Determine if the function was called as an API.
            if api == True:

                # Format a successful response.
                self.status = "Pass"
                self.object = {"command_details": self.command_details}
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: unhide_house_or_hotel.")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def update_property_icon_class(self, api=False):

        try:
            # Instruct the operator to update owner and mortgaged attributes of the class of a property icon.
            # The owner and mortgaged are taken from the property.
            self.command_details = {}
            self.command_details["command"] = "Update Property Icon Class"
            self.command_details["property_key"] = self.property_key

            # Send the instruction to all players.
            self.send_command_to_all_players()

            # Determine if this is an API call.
            if api == True:

                # Format a successful response.
                self.status = "Pass"
                self.object = {"command_details": self.command_details}
                return self.format_response()

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: update_property_icon_class")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def update_property_mortgaged(self, api=False):

        try:
            # Instruct a player to update the mortgaged attribute of a property.
            self.command_details = {}
            self.command_details["command"] = "Update Property Mortgaged"
            self.command_details["property_key"] = self.property_key
            self.command_details["mortgaged"] = self.property["mortgaged"]

            # Send the instruction to alll players.
            self.send_command_to_all_players()

            # Determine if this is an API call.
            if api == True:

                # Return pass response.
                self.status = "Pass"
                self.object = {"command_details": self.command_details}
                return format_response()

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: update_property_mortgaged")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def sort_queue(self, transaction, api=False):

        try:
            # Determine if this is an API call.
            if api == True:

                # Return a response suitable for a browser.
                self.status = "Pass"
                self.object = {"timestamp": transaction["timestamp"]}
                return self.format_response()

            else:

                # Sort the transactions in a queue for a player by timestamp.
                return transaction["timestamp"]

        except Exception as e:

            print("\n**********")
            print("Error: Monopoly.py: Monopoly: sort_queue")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def get_player_queue(self, api=False):

        try:
            # Get a reference to the queue for the player.
            player_queue = self.player["queue"]

            # Sort the transactions into chronological order.
            player_queue.sort(key=self.sort_queue)

            # Determine if this function was called as an API.
            if api == True:

                # Return a response suitable for a browser.
                self.status = "Pass"
                self.object = {"player_queue": player_queue}
                self.format_response()

            else:

                # Return the sorted queue of the player.
                return player_queue

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: get_player_queue")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    # The Trade Button unhides the Trade Screen with Offer, Cancel, and End Game buttons.
    # The Trade Details consists of the following.
    # action: Offer | Reject | Accept | Cancel
    # player: key, amount, properties[3]
    # other_player: key, amount, properties[3]

    def send_the_offer(self, api=False):
        # This function is invoked by the Offer Button via the "Offer" action of the "Trade" transaction action.
        # This function adds the Trade Offer command to the queue of the other player.
        # When the client of the other player receives the Trade Offer command in the queue, it updates the Trade Screen.
        # When the client of the receives the Trade Offer command in the queue, it unhides the Trade Screen if necessary.
        self.command_details = {}
        self.command_details["command"] = "Trade Offer"
        self.command_details["offer_details"] = copy.deepcopy(self.trade_details)
        if self.trade_details["player"]["key"] == self.player_key:
            self.send_command_to_a_player(player_key = self.trade_details["other_player"]["key"])
        else:
            self.send_command_to_a_player(player_key = self.trade_details["player"]["key"])
    
    def reject_the_offer(self, api=False):
        # This function is invoked by the Reject Button via the "Reject" action of the "Trade" transaction.
        # The Reject Button also hides the Trade Screen.
        # This function adds the "Reject Offer" command to the queue of the other player.
        # When the client of the other player receives the Reject Offer command in the queue, it hides the Trade Screen.
        self.command_details = {}
        self.command_details["command"] = "Reject Offer"
        self.command_details["offer_details"] = copy.deepcopy(self.trade_details)
        if self.trade_details["player"]["key"] == self.player_key:
            self.send_command_to_a_player(player_key = self.trade_details["other_player"]["key"])
        else:
            self.send_command_to_a_player(player_key = self.trade_details["player"]["key"])

    def accept_the_offer(self, api=False):
        # This function is invoked by the Accept Button via the "Accept" action of the "Trade" transaction.
        # The Accept Button also hides the Trade Screen.
        # This function adds the "Accept Offer" command to the queue of the other player.
        # This function handles the transfers and notifications.
        # When the client of the other player receives the Accept Offer command in the queue, it hides the Trade Screen.
        self.command_details = {}
        self.command_details["command"] = "Accept Offer"
        self.command_details["offer_details"] = copy.deepcopy(self.trade_details)
        if self.trade_details["player"]["key"] == self.player_key:
            self.send_command_to_a_player(player_key = self.trade_details["other_player"]["key"])
        else:
            self.send_command_to_a_player(player_key = self.trade_details["player"]["key"])

    def cancel_the_offer(self, api=False):
        # This function is invoked by the Cancel Button via the "Cancel" action of the "Trade" transaction.
        # This function adds the "Cancel Offer" command to the queue of the other player.
        # When the client of the other player receives the Cancel Offer command in the queue, it hides the Trade Screen.
        self.command_details = {}
        self.command_details["command"] = "Cancel Offer"
        self.command_details["offer_details"] = copy.deepcopy(self.trade_details)
        if self.trade_details["player"]["key"] == self.player_key:
            self.send_command_to_a_player(player_key = self.trade_details["other_player"]["key"])
        else:
            self.send_command_to_a_player(player_key = self.trade_details["player"]["key"])

    # When the player is moved to a property that is unowned, the Auction Screen is displayed with Bid, Fold, End Game buttons.
    # The details of the "Auction" transaction include bids/folds of all players.  bids[4] and property_key

    def process_the_bid(self, api=True):
        # This function is invoked by the Bid Button or Fold Button via the transaction details in the "Auction" transaction.
        # When there are two folds, this function adds "End Auction" command to all players and handles the transfers.
        # Otherwise, this function adds the "Make Bid" command to the queue of the next player with the updated command details.
        # When the client of the next player receives the "Make Bid" command from the queue, it updates the Auction Screen
        # When the client of the next player recieves the "Make Bid" command, it will unhide the Auction Screen if necessary.
        # When the client of the next player receives the "End Auction" command from the queue, it hides the Auction Screen.
        
        try:
            # Verify that the transaction contains auction details.
            if "auction_details" in self.details:

                auction_details = self.details["auction_details"]
                auction_bids = auction_details["bids"]
                auction_property_key = auction_details["property_key"]
                auction_property = self.properties["auction_property_key"]

            else:

                # The transaction did not contain auction details.
                raise Exception("auction_details were not in self.details")

            # Define a counter for the number of players who have folded.
            number_of_folds = 0

            # Loop through the bids.
            for i in range(1,5):

                # Determine if the player has folded.
                if auction_bids[i] == "Fold": 
                    
                    # The player folded.
                    number_of_folds += 1

                else:

                    # Record the potential winner and their bid.
                    auction_winner_key = copy.copy(i)
                    auction_winner_bid = copy.copy(auction_bids[i])

            # Determine if three of the four players have folded.
            if number_of_folds > 2:

                # Get a reference to the player with the winning bid.
                auction_winner = self.players[auction_winner_key]

                # Add the key of the property just won to the property keys of the winning player.
                auction_winner["property_keys"].append(self.property_key)

                # Determine if the winning bid is numeric.
                if auction_winner_bid.isnumeric():

                    # The winning bid is numberic.
                    auction_winner_bid = int(auction_winner_bid)

                else:

                    # If the winning bid is not numeric (Fold), then default to zero.
                    auction_winner_bid = 0

                # The winning player pays the bank.
                auction_winner["balance"] -= auction_winner_bid

                # Update the balance of the player in games of all players.
                self.update_player_balance(player_key=auction_winner_key)

                # Add the property key to the property keys of the winning playr.
                auction_winner["property_keys"] = copy.copy(auction_property_key)

                # Update the owner of the property in the games of all players.
                self.update_property_owner(player_key=auction_winner_key, property_key=auction_property_key)

                # Instruct all players to hide the Auction Screen and be informed of the winner
                self.command_details = {}
                self.command_details["command"] = "End Auction"
                self.command_details["auction_winner_name"] = auction_winner["name"]

                # Send the instruction to all players.
                self.send_command_to_all_players()

            else:

                # Instruct the next player to make a bid and to unhide the Auction Screen if necessary.
                self.command_details = {}
                self.command_details["command"] = "Make A Bid"
                self.command_details["auction_details"] = copy.deepcopy(auction_details)

                # Increment the player_key
                player_key = self.player_key + 1
                if player_key > 4: player_key = 1

                # Send the instruction to the next player.
                self.send_command_to_a_player(player_key=player_key)

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: process_the_bid")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def roll_the_dice(self, api=False):
        # This method is invoked by the Roll Button via "Roll Dice" transaction action.

        # Roll the dice.
        self.dice_1 = random.randint(1, 6)
        self.dice_2 = random.randint(1, 6)
        self.dice = self.dice_1 + self.dice_2

        # Determine if doubles were rolled.
        if self.dice_1 == self.dice_2:
            self.doubles_were_rolled = True
        else:
            self.doubles_were_rolled = False

        # Update the doubles attribute of the player.
        if self.doubles_were_rolled == True:
            self.player["doubles"] += 1
        else:
            self.player["doubles"] = 0

        # Determine if player is in jail.
        if self.player["jail"] == True:

            # Increment the number of rolls while in jail.
            self.player["rolls_in_jail"] += 1

            # Determine if player rolled doubles.
            if self.player["doubles"] > 0:

                # The player is moved to the jail lobby.  Determine buttons to be displayed.
                self.get_player_out_of_jail()

            # Determine if player has rolled three times while in jail.
            elif self.player["rolls_in_jail"] > 2:

                # The player pays the fine.  The player is moved to the jail lobby.  Determine the buttons to be displayed
                self.make_the_payment()

            else:

                # Determine the buttons to be displayed.
                self.determine_buttons_to_be_displayed()

        # Determine if the player has rolled doubles three times in a row.
        elif self.player["doubles"] > 2:

                # Send the player to jail.
                self.move_player_into_jail

        else:

            # Store the previous sequence that is used in the move multiple times function.
            self.previous_sequence = self.player["sequence"]

            # Update the sequence of the player with the roll of the dice.
            self.player["sequence "] += self.dice
            if self.player["sequence"] > 40:
                self.player["sequence"] -= 40

            # Move the player and process the property.
            self.move_player_multiple_times()

    def end_turn(self, api=False):
        # This function is invoked by the End Turn Button via the "End Turn" transaction action.

        # Instruct the next player to roll the dice.
        try:

            # Determine the next player.
            self.player_key += 1
            if self.player_key > 4:
                self.player_key = 1

            # Display the buttons for the next player.
            self.determine_buttons_to_be_displayed()        

        except Exception as e:

            print("\n**********")
            print("Exception: Monopoly.py: Monopoly: end_turn")
            print("Exception: " + str(e))
            print("**********")
            traceback.print_exc()
            return self.set_error_encountered()

    def buy_the_property(self, api=False):

        # The property key is the key of the property where the player is located.
        self.property_key = self.player["sequence"]

        # Get a reference to the property.
        self.property = self.properties[self.property_key]
        
        # Subtract the price of the property from the balance of the player.
        self.player["balance"] -= self.property["price"]

        # Update the balance of the player in the games of all players.
        self.update_player_balance()

        # Add the key of the property to the property keys of the player.
        self.player["property_keys"].append(copy.copy(self.property_key))

        # Set the owner key of the property to the key of the player.
        self.property["owner_key"] = copy.copy(self.player_key)

        # Update the owner key of the property in the games of all players.
        self.update_property_owner()

        # Update the class of the property icon with the owner key taken from the property.
        self.update_property_icon_class()

        # Display the buttons based on the state of the player.
        self.determine_buttons_to_be_displayed()

    def invalid_transaction_action(self):

        print("\n**********")
        print("Error: Monopoly.py:Monopoly: invalid_transaction")
        print("Transaction Action: " + self.transaction_action)
        print("**********")
        traceback.print_exc()

        # Define a transaction to notify the player.
        transaction = {}
        transaction["timestamp"] = datetime.datetime.now().isoformat()
        transaction["action"] = "Display Message"

        # Notify the player.
        details = {'message":"Transaction action "{}" was invalid.'.format(self.transaction_action)}
        transaction["details"] = details
        self.player["queue"].append(copy.deepcopy(transaction))

        # Format response
        self.status = "Fail"
        self.object = None
        return self.format_response()
