from flask import Flask
from flask_restful import Resource,Api
from flask_restful import reqparse
from pymongo import MongoClient 

app = Flask(__name__)

api = Api(app)

connection = MongoClient('localhost', 27017)

db = connection['ufcdatavis']

#??
parser = reqparse.RequestParser()

#Collections:
#dishes, menus e itens_menu

class Location(Resource):

	# For now return just the restaurants, 
	# Waiting for the database modifications so it can return the restaurant identification with coordenates
	@staticmethod
	def get():

		menu_collection = db['menus']

		data = menu_collection.find({}, {'_id': False})

		restaurents = []

		for element in data:
			if element['name'] != "":
				restaurents.append(element)
		# 	#restaurents.insert({'name':element.name, 'lat':element.lat,'lon':element.lon})	
		# 	restaurents.insert({'name':element.name, 'sponsor': element.sponsor,'location':element.location})

		return restaurents

class ItensRestaurant(Resource):

	#return itens of one restaurante - recive as parameter the restaurant id
	@staticmethod
	def get(id_place):

		itens_menu_collection = db['itens_menu']
		dishes = db['dishes']

		data_itens_menu = itens_menu_collection.find({'menu_id':int(id_place)},{'_id':False})


		itens = []

		print(data_itens_menu.count())
		total = data_itens_menu.count()
		num = 1
		for iten_menu  in data_itens_menu:
			print('----------------------------------')
			print(str(num)+' of '+ str(total))
			num= num+1
			data_dishes = dishes.find({'id':iten_menu['dish_id']},{'_id':False})
			print(data_dishes)
			for element in data_dishes:
				itens.append(element)


		return itens

class RestaurentsSameIten(Resource):

	@staticmethod
	def get(id_place):
		pass
		itens_menu_collection = db['itens_menu']
		menus_collection = db['menus']

		itens_menu_data = itens_menu_collection.find({'menu_id':int(id_place)},{'_id':False})

		itens =  []

		for iten_menu in itens_menu_data:
			print(iten_menu)

			itens_menu_data_aux = itens_menu_collection.find({'dish_id':iten_menu['dish_id']},{'_id':False})

			for iten in itens_menu_data_aux:
				print iten
				if iten['menu_id'] != id_place:
					menus_data = menus_collection.find({'id':iten['menu_id']})	

					for menu in menus_data:
						itens.append(menu)
		return itens				



# For now return just the restaurants, 
# Waiting for the database modifications so it can return the restaurant identification with coordenates
api.add_resource(Location, '/locations/', endpoint='get_locations')

#return itens of one restaurante - recive as parameter the restaurant id
api.add_resource(ItensRestaurant, '/restaurant/itens/<string:id_place>/', endpoint='dishes')

api.add_resource(RestaurentsSameIten, '/restaurant/similar/<string:id_place>/', endpoint='restaurentsSimilar')

app.run(host='0.0.0.0', port=8000, debug=True)