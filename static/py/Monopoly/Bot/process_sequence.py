# Get the add_balance function from the roll_dice module.
from static.py.Monopoly.Bot import roll_dice
import datetime
import copy
import json


def process_sequence(self, property):

    # Calculate net worth of the bot.
    calculate_net_worth(self)

    # Define convenience variables for the bot.
    bot = self.bot

    # Determine if the property has an owner.
    if "owner" in property.keys() and property["owner"] != "board":

        # Define convenience variables.
        property_owner_key = property["owner"]

        # Determine if the bot already owns the property.
        if bot["key"] == property_owner_key:

            print("\n{0} already owns {1}.".format(bot["name"], property["name"]))
            return

        # The purchase price of a free-and-clear property is full price.
        purchase_price = property["price"]

        # Determine if the property is owned by the bank.
        if property_owner_key == "bank":

            if "mortgage" in property.keys() and "mortgaged" in property.keys():

                # Determine the property owned by the bank is mortgaged.
                if property["mortgaged"] == True:

                    # The purchase price of a mortgaged property is full price less mortgage.
                    purchase_price = property["price"] - property["mortgage"]

            # Determine if the cash and mortgage values of properties owned by the bot are sufficient to purchase the property.
            if bot["net_worth"] > purchase_price:

                # Deduct the property price from the balance of the bot.
                roll_dice.subtract_balance(self, purchase_price)

                # Assign the Bot to the Property.
                # property["owner"] = bot["key"]
                self.properties.properties[property["key"]]["owner"] = self.bot["key"]

                # Assign the Property to the Bot.
                # bot["property["key"]s"].append(property["key"])
                self.bot["property_keys"].append(property["key"])

                # Notify all players and Bots of the change in ownership.
                notify_players_of_ownership_change(self, property)

                print("\n{} purchased {}.".format(bot["name"], property["name"]))
                return

            else:

                print("\n{} started an auction for {}.".format(bot["name"], property["name"]))

                # Move the Bot on Boards of all players and bots.
                for player_key in self.players.players:

                    # Define a transaction for a Player.
                    transaction = {}

                    # Add timestamp to the transaction for sorting.
                    transaction["timestamp"] = datetime.datetime.now().isoformat()

                    # Set the action attribute of the transaction.
                    transaction["action"] = "Auction"

                    # Define details for the transaction.
                    details = {}
                    details["in"] = True
                    details["starter_key"] = self.bot["key"]
                    details["doubles_were_rolled"] = self.doubles_were_rolled
                    details["property"] = copy.deepcopy(property)
                    details["highest_bid"] = 0
                    details["highest_bidder_key"] = self.bot["key"]
                    details["bids"] = {}

                    for player_key in self.players.players.keys():

                        details["bids"][player_key] = 0

                    details["number_of_folds"] = 0

                    # Add details to the transaction.
                    transaction["details"] = details

                    # Add the transaction to the queue of a Player.
                    self.players.player_queue[player_key].append(transaction)

                    return

        # Determine if the property can be mortgaged.
        if "mortgaged" in property.keys():

            # Determine if the property is mortgaged.
            if property["mortgaged"] == True:

                # Get the name of the owner of the property.
                property_owner_name = self.players.players[property_owner_key]["name"]

                print("\n{} paid no rent for the mortgaged {} to {}.".format(bot["name"], property["name"], property_owner_name))
                return

    # Process the type of property.
    if property["type"] == "go":

        process_property_type_go(self, property)

    elif property["type"] == "property":

        process_property_type_property(self, property)

    elif property["type"] == "railroad":

        process_property_type_railroad(self, property)

    elif property["type"] == "utility":

        process_property_type_utility(self, property)

    elif property["type"] == "tax":

        process_property_type_tax(self, property)

    elif property["type"] == "community_chest":

        process_property_type_community_chest(self, property)

    elif property["type"] == "chance":

        process_property_type_chance(self, property)

    elif property["type"] == "jail":

        process_property_type_jail(self, property)

    elif property["type"] == "free_parking":

        process_property_type_free_parking(self, property)

    elif property["type"] == "go_to_jail":

        process_property_type_go_to_jail(self, property)

    else:
        print("\nError: process_sequence.py: process_sequence")
        print("Invalid property type: " + property["type"])


def process_property_type_go(self, property):

    # Define convenience variables.
    bot = self.bot
    bot["name"] = bot["name"]
    salary = int(property["salary"])

    # Add the salary to the balance of the bot and notify all players and bots.
    roll_dice.add_balance(self, salary)

    print("\n{} collected a salary of {:n} for landing on Go.".format(bot["name"], salary))
    return


def process_property_type_property(self, property):

    # Define convenience variables.
    bot = self.bot
    bot["name"] = bot["name"]
    property_owner_key = property["owner"]
    property_owner = self.players.players[property_owner_key]
    property_owner_name = property_owner["name"]

    if property["hotels"] > 0:

        # Extract the hotel rent from the Property.
        hotel_rent = property["hotel_rent"]

        if hotel_rent > self.bot["net_worth"]:

            bankruptcy(self, property)
            return

        else:

            # Subtract the hotel rent from the balance of the Bot and notify all players and bots.
            roll_dice.subtract_balance(self, hotel_rent)

            # Add the hotel rent to the balance of the owner and notify all players and bots.
            roll_dice.add_balance_to_other_player(self, property_owner, hotel_rent)

            print("\n{} paid hotel rent of {:n} for {} to {}.".format(bot["name"], hotel_rent, property["name"], property_owner_name))
            return

    if property["houses"] > 0:

        house_rent_index = property["houses"] - 1

        house_rent = property["house_rents"][house_rent_index]

        # Subtract the house rent from the balance of the Bot and notify all players and bots.
        roll_dice.subtract_balance(self, house_rent)

        # Add the rent to the balance of the owner and notify all players and bots.
        roll_dice.add_balance_to_other_player(self, property_owner, house_rent)

        print("\n{} paid house rent of {:.0f} for {} to {}.".format(bot["name"], house_rent, property["name"], property_owner_name))
        return

    rent = int(property["rent"])

    if is_one_owner_color_group(self, property) == True:

        double_rent = rent * 2

        if double_rent > self.bot["net_worth"]:

            bankruptcy(self, property)
            return

        else:

            # Subtract the double rent from the balance of the Bot and notify all players and bots.
            roll_dice.subtract_balance(self, double_rent)

            # Add the double rent to the balance of the owner and notify all players and bots.
            roll_dice.add_balance_to_other_player(self, property_owner, double_rent)

            print("\n{} paid double rent of {:.0f} for {} to {}.".format(bot["name"], double_rent, property["name"], property_owner_name))
            return

    if rent > self.bot["net_worth"]:

        bankruptcy(self, property)
        return

    else:

        # Subtract the rent from the balance of the Bot and notify all players and bots.
        roll_dice.subtract_balance(self, rent)

        # Add the rent to the balance of the owner and notify all players and bots.
        roll_dice.add_balance_to_other_player(self, property_owner, rent)

        print("\n{} paid rent of {:.0f} for {} to {}.".format(bot["name"], rent, property["name"], property_owner_name))
        return


def process_property_type_railroad(self, property):

    # Define convenience variables.
    bot = self.bot
    bot["name"] = bot["name"]
    property["name"] = property["name"]
    property_owner_key = property["owner"]
    property_owner = self.players.players[property_owner_key]
    property_owner_name = property_owner["name"]

    # Define the counters of railroads owned by the property owner.
    number_of_railroads_owned = 0

    if self.properties.properties["reading_railroad"]["owner"] == property_owner_key:
        number_of_railroads_owned += 1

    if self.properties.properties["pennsylvania_railroad"]["owner"] == property_owner_key:
        number_of_railroads_owned += 1

    if self.properties.properties["b_o_railroad"]["owner"] == property_owner_key:
        number_of_railroads_owned += 1

    if self.properties.properties["short_line_railroad"]["owner"] == property_owner_key:
        number_of_railroads_owned += 1

    if number_of_railroads_owned == 1:
        fare = 25
    elif number_of_railroads_owned == 2:
        fare = 50
    elif number_of_railroads_owned == 3:
        fare = 100
    else:
        fare = 200

    if fare > self.bot["net_worth"]:

        bankruptcy(self, property)
        return

    else:

        # Subtract the fare from the balance of the Bot and notify all player and bots.
        roll_dice.subtract_balance(self, fare)

        # Add the fare to the balance of the owner and notify all players and bots.
        roll_dice.add_balance_to_other_player(self, property_owner, fare)

        print("\n{} paid fare of {:.0f} for {} to {}.".format(bot["name"], fare, property["name"], property_owner_name))
        return


def process_property_type_utility(self, property):

    # Define convenience variables.
    bot = self.bot
    bot["name"] = bot["name"]
    property["name"] = property["name"]
    property_owner_key = property["owner"]
    property_owner = self.players.players[property_owner_key]
    property_owner_name = property_owner["name"]
    electric_company_owner_key = self.properties.properties["electric_company"]["owner"]
    water_works_owner_key = self.properties.properties["water_works"]["owner"]

    # Determine if the property owner owns both utilities.
    if property_owner_key == electric_company_owner_key and property_owner_key == water_works_owner_key:

        # The utility bill is ten times the roll of the dice when the property owner owns both utilities.
        utility_bill = self.dice * 10

    else:

        # The utility bill is four times the roll of the dice.
        utility_bill = self.dice * 4

    if utility_bill > self.bot["net_worth"]:

        bankruptcy(self, property)
        return

    else:

        # Subtract the water bill from the balance of the Bot and notify all players and bots.
        roll_dice.subtract_balance(self, utility_bill)

        # Add the water bill to the balance of the owner and notify all players and bots.
        roll_dice.add_balance_to_other_player(self, property_owner, utility_bill)

        print("\n{} paid {:.0f} for {} to {}.".format(bot["name"], utility_bill, property["name"], property_owner_name))
        return


def process_property_type_tax(self, property):

    # Define convenience variables.
    bot = self.bot
    bot["name"] = bot["name"]
    property["name"] = property["name"]
    tax = property["tax"]

    if tax > self.bot["net_worth"]:

        bankruptcy(self, property)
        return

    else:

        # Subtract the tax from the balance of the Bot and notify all players and bots.
        roll_dice.subtract_balance(self, tax)

        print("\n{} paid {:.0f} for {}.".format(bot["name"], tax, property["name"]))
        return


def process_property_type_community_chest(self, property):

    # Process community chest event.
    property = self.community_chest.process_community_chest_event(self.bot)

    # Determine if the community chest event moved the property to a new sequence.
    if property != None:

        # Process the player recursively in the new sequence.
        process_sequence(self, property)


def process_property_type_chance(self, property):

    # Process the chance event.
    property = self.chance.process_chance_event(self.bot)

    # Determine if the chance event moved the property to a new sequence.
    if property != None:

        # Process the player recursively in the new sequence.
        process_sequence(self, property)


def process_property_type_jail(self, property):

    # Define convenience variables.
    bot = self.bot
    bot["name"] = bot["name"]

    print("\n{} is just visting Erroll in Jail.".format(bot["name"]))


def process_property_type_free_parking(self, property):

    # Define convenience variables.
    bot = self.bot
    bot["name"] = bot["name"]

    print("\n{} relaxing in Free Parking.".format(bot["name"]))


def process_property_type_go_to_jail(self, property):

    # Incarcerate Bot.
    self.bot["number_of_doubles"] = 0
    self.bot["doubles_were_rolled"] = False
    self.bot["jail"] = True
    self.bot["number_of_rolls_in_jail"] = 0

    # When moving bot on other boards, the bot is moved into jail.
    print('\n{} is now in jail for landing on "GO TO JAIL" property.'.format(self.bot["name"]))
    return


def is_one_owner_color_group(self, property):

    # Only check for one owner if the property has the attribute of color.
    if "color" in property.keys():

        # Examine each property in properties.
        for property_member_key in self.properties.properties:

            property_member = self.properties.properties[property_member_key]

            # Only examine properties that have a property attribute.
            if "color" in property_member.keys():

                # Determine if the property is in the same color group as the parameter property.
                if property_member["color"] == property["color"]:

                    # Determine if there is an owner who is different than the owner of the parameter property.
                    if property_member["owner"] != property["owner"]:

                        # Not all properties in the color group are owned by the same player.
                        return False
            else:

                # Property like Go, Jail, and Free Parking do not have a color.
                continue

        # All properties in the color group are owned by a single player.
        return True

    else:

        # The property parameter did not have a color attribute.
        return False


def notify_players_of_ownership_change(self, property):

    # Notify all players and bots of the change in ownership.
    for player_key in self.players.players:

        # Define a transaction for a Player
        transaction = {}

        # Add timestamp used for sorting.
        transaction["timestamp"] = datetime.datetime.now().isoformat()

        # Set the action attribute of the transaction.
        transaction["action"] = "Update Property"

        # Define details for the transaction.
        details = {}
        details["target_player_key"] = self.bot["key"]
        details["property_key"] = property["key"]

        # Add the details to the transaction.
        transaction["details"] = details

        # Add the transaction to the queue of a Player.
        self.players.player_queue[player_key].append(copy.deepcopy(transaction))

    # Update the Property Icon Class for all players and bots.
    for player_key in self.players.players:

        # Define a transaction for a Player
        transaction = {}

        # Add timestamp used for sorting.
        transaction["timestamp"] = datetime.datetime.now().isoformat()

        # Set the action attribute of the transaction.
        transaction["action"] = "Update Property Icon Class"

        # Define details for the transaction.
        details = {}
        try:
            details["property"] = json.dumps(self.properties.properties[property["key"]])
        except Exception as e:
            print("\nError: process_sequence.py: notify_players_of_ownership_change")
            print("Exception: " + str(e))
            print("type property: " + str(type(self.properties.properties[property["key"]])))
            print("property: " + json.dumps(self.properties.properties[property["key"]]))

        # Add the details to the transaction.
        transaction["details"] = details

        # Add the transaction to the queue of a Player.
        self.players.player_queue[player_key].append(copy.deepcopy(transaction))


def calculate_net_worth(self):

    # Get a reference to the current player.
    # Self as bot, okay.  Calling from Chance as self.players?
    player = self.players.players[self.bot["key"]]

    # Define an accumulator for net worth.
    player["net_worth"] = player["balance"]

    # Get the key for each property owned by this bot.
    for property_key in self.bot["property_keys"]:

        # Get a reference to each property owned by this bot.
        property = self.properties.properties[property_key]

        # Determine if the property is mortgaged.
        if property["mortgaged"] == True:

            # Do not include mortgaged properties in the net worth.
            continue

        # Add the mortgage value to the net worth.
        # The roll_dice.subtract_balance(self, price) will mortgage properties to meet payment requirements.
        player["net_worth"] += property["mortgage"]


def bankruptcy(self, property):

    print("\nDebug: process_sequence.bankruptcy in progress")
    print("Bot: " + self.bot["name"])
    print("Property Type: " + str(type(property)))
    print("Property: " + json.dumps(property, indent=4))

    # Set the state of the bot to bankrupt.
    self.bot["bankrupt"] = True

    # Determine if the property that caused the bankruptcy has an owner
    # attribute.
    if "owner" in property.keys():

        # Get the owner key of the property.
        property_owner_key = property["owner"]

        # Determine if the owner of the property that caused the bankruptcy is a
        # player
        if property_owner_key not in self.players.players.keys():

            # The property owner was not a player, so assume it is the bank.
            property_owner_key = "bank"

    else:

        # If the property that caused the bankuptcy does not have an owner
        # attribute, assume the property owner is the bank.
        property_owner_key = "bank"

    # Determine if the property owner is the bank.
    if property_owner_key == "bank":

        # The name of the property owner is "Bank".
        property_owner_name = "Bank"

    else:

        # Get the name of the property owner.
        property_owner_name = self.players.players[property_owner_key]["name"]

    print("{} has bankrupt {} with property {}.".format(property_owner_name, self.bot["name"], property["name"]))

    # Get the current balance of the player.
    balance = self.bot["balance"]

    # Subtract the balance from the bot and notify all players.
    roll_dice.subtract_balance(self, balance)

    # Determine if the property owner is not the bank.
    if property_owner_key != "bank":

        # Get the property owner when the owner is a player.
        property_owner = self.players.players[property_owner_key]

        # Add the balance of the bankrupt bot to the balance of the property
        # owner.
        roll_dice.add_balance_to_other_player(self, property_owner, balance)

    else:

        # The property that caused the bankruptcy was not owned by a player.
        property_owner = None

    # Get each property key of the properties owned by the bankrupt bot.
    for bankrupt_property_key in self.bot["property_keys"]:

        # Add the property to the property owner of the property that bankrupt
        # the bot.
        if property_owner != None:

            # The owner of the property that caused the bankruptcy was a player.
            # Add a bankrupt proptery to them.
            property_owner["property_keys"].append(bankrupt_property_key)

            print("{} received {} from bankrupt {}.".format(property_owner["name"], bankrupt_property_key, self.bot["name"]))

        # Update the owner of the property with the owner of the property that
        # caused the bankruptcy.  If that owner is not a player, then the owner
        # of the bankrupt property is set to "bank".
        self.properties.properties[bankrupt_property_key]["owner"] = property_owner_key

        # Get the name of the property that cause the bankruptcy for logging.
        bankrupt_property_name = self.properties.properties[bankrupt_property_key]["name"]

        # Determine if the property is owned by the bank.
        if property_owner_key == "bank":

            # The name of the owner of the property owned by the bank is "Bank".
            property_owner_name = "Bank"

        else:

            # Get the name of the owner of the property for logging.
            property_owner_name = self.players.players[property_owner_key]["name"]

        print("{} had its ownership changed to {}.".format(bankrupt_property_name, property_owner_name))

        # Notify all playersof the change in ownership.
        for player_key in self.players.players:

            # Define a transaction for a Player
            transaction = {}

            # Add timestamp used for sorting.
            transaction["timestamp"] = datetime.datetime.now().isoformat()

            # Set the action attribute of the transaction.
            transaction["action"] = "Update Property"

            # Define details for the transaction.  The property owner key will
            # be "bank" if the owner of the property that caused the bankruptcy
            # is not a player.
            details = {}
            details["target_player_key"] = property_owner_key
            details["property_key"] = bankrupt_property_key

            # Add the details to the transaction.
            transaction["details"] = details

            # Add the transaction to the queue of a Player.
            self.players.player_queue[player_key].append(copy.deepcopy(transaction))

        # Update the Property Icon Class for all players.
        for player_key in self.players.players.keys():

            # Define a transaction for a Player
            transaction = {}

            # Add timestamp used for sorting.
            transaction["timestamp"] = datetime.datetime.now().isoformat()

            # Set the action attribute of the transaction.
            transaction["action"] = "Update Property Icon Class"

            # Define details for the transaction.
            details = {}
            details["property"] = json.dumps(self.properties.properties[bankrupt_property_key])

            # Add the details to the transaction.
            transaction["details"] = details

            # Add the transaction to the queue of a Player.
            self.players.player_queue[player_key].append(copy.deepcopy(transaction))

    # Get each property key of the properties owned by the bankrupt bot.
    for bankrupt_property_key in self.bot["property_keys"]:

        # Remove the property from the bankrupt bot.
        self.bot["property_keys"].remove(bankrupt_property_key)

    # Move the bankrupt bot to the poorhouse on the boards of all players.
    for player_key in self.players.players:

        # Define a transaction for a Player
        transaction = {}

        # Add timestamp to the transaction for sorting.
        transaction["timestamp"] = datetime.datetime.now().isoformat()

        # Set the action attribute of the transaction.
        transaction["action"] = "Poorhouse"

        # Define details for the transaction.
        details = {}
        details["target_player_key"] = self.bot["key"]

        # Add the details to the transaction.
        transaction["details"] = details

        # Add the transaction to the queue of a Player.
        self.players.player_queue[player_key].append(copy.deepcopy(transaction))

    # Determine if the new owner of the property is the bank.
    if property_owner_key == "bank":

        # Log that the new owner is the bank.
        print("\n{} is now in bankrupt and the bank received all of the properties.".format(self.bot["name"]))
    else:

        # Log that the bot is bankrupt and the name of the new owner.
        print("\n{} is now in bankrupt and {} received all of the properties.".format(self.bot["name"], property_owner["name"]))
