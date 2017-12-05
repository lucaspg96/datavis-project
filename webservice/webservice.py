from flask import Flask
from flask_restful import Resource,Api
from flask_restful import reqparse
from flask_cors import CORS
from pymongo import MongoClient 
import json

app = Flask(__name__)
CORS(app)
api = Api(app)

connection = MongoClient('localhost', 27017)

db = connection['ufcdatavis']

#??
parser = reqparse.RequestParser()
locations = {}

# with open("../locations-2017-11-16 12:42:08.068035.txt") as f:
# 	for line in f:
# 		place,coords= line.split(" -> ")
# 		coords = coords.replace("\n","")
# 		data = db['menus'].find_one({"place":place})

# 		if not data:
# 			place = place.rstrip()

# 			data = db['menus'].find_one({"place":place})
# 			if not data:
# 				place = place.rstrip()
# 				print("{} -> {}".format(place,len(place)))
# 				not_found+=1

# 			else:
# 				name = data['place']
# 				locations[name] = {'lat':coords.split(',')[0],'lng':coords.split(',')[1]}
		
# 		else:
# 			name = data['place']
# 			locations[name] = {'lat':coords.split(',')[0],'lng':coords.split(',')[1]}

# with open("location.json",'w') as f:
# 	json.dump(locations,f,indent=4)

with open("location.json") as f:
	locations = json.load(f)


print("{} locations loaded".format(len(locations)))
#Collections:
#dishes, menus e itens_menu

class Location(Resource):

	# For now return just the restaurants, 
	# Waiting for the database modifications so it can return the restaurant identification with coordenates
	@staticmethod
	def get():

		menu_collection = db['menus']

		data = menu_collection.find({}, {'_id': False,'place':True,'id':True, 'event':True,'date':True,
											'page_count':2,	'dish_count':True})

		restaurents = []
		for element in data:
			# if element['name'] != "":
				# restaurents.append(element)
			if element['place'] in locations:
				element.update({"lat":locations[element['place']]['lat'],"lng":locations[element['place']]['lng']})
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
				print(iten)
				if iten['menu_id'] != id_place:
					menus_data = menus_collection.find({'id':iten['menu_id']})	

					for menu in menus_data:
						menu['_id'] = str(menu['_id'])
						itens.append(menu)
		return itens				

#Class for analyze the data about all dishes
class DishesStats(Resource):

    @staticmethod
    def get(attribute, minimum, maximum):

        #collections with dishes
        dishes = db['dishes']

        #find the dishes with the params threshold
        dishes_result = dishes.find({attribute : {'$gt' : minimum}, attribute : {'$lte' : maximum} },{'_id':False})
        
        dishes = []
        
        for dish in dishes_result:
            dishes.append(dish)
        
        return dishes

class DishesInfo(Resource):
       
    @staticmethod
    def get(typeTop, minimum):
        menus = db['menus']
        dishes = db['dishes']

        dishes_ids = menus.group({
            'key': {"dish_id" : 1},
            'cond': {"price" : {'$gt' : minimum} },
            'reduce': Code("""function(curr, result ) {
                result.count++;
            }"""),
            'initial': { count : 0 }
        }).sort({'count': -1}).limit(10)
        
        ids = []
        for i in dishes_ids:
            ids.append(i['dish_id'])
        
        query = dishes.find({'dish_id' : {'$in': ids} })

        result = []
        for dish in query:
            result.append(dish)
            
        return result    
        
# For now return just the restaurants, 
# Waiting for the database modifications so it can return the restaurant identification with coordenates
api.add_resource(Location, '/locations/', endpoint='get_locations')

#return itens of one restaurante - recive as parameter the restaurant id
api.add_resource(ItensRestaurant, '/restaurant/itens/<string:id_place>/', endpoint='dishes')

api.add_resource(RestaurentsSameIten, '/restaurant/similar/<string:id_place>/', endpoint='restaurentsSimilar')

api.add_resource(DishesStats, '/restaurant/similar/<string:attribute>/<string:minimum>/<string:maximum>', endpoint='dishesStats')

api.add_resource(DishesInfo, '/restaurant/similar/<string:typeTop>/<string:minimum>', endpoint='dishesInfo')

app.run(host='0.0.0.0', port=8000, debug=True)