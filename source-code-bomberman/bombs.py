from math import cos, sin, radians

# set game and screen sizes
SIZE = 9
WIDTH  = SIZE*45 - 5
HEIGHT = SIZE*45 - 5

# bomb range
RANGE = 3

# constants for tile types
GROUND    = 0
WALL      = 1
BRICK     = 2
BOMB      = 3
EXPLOSION = 4
# images for tile types
images = ['ground','wall','brick','bomb','explosion']

# create player in top-left of the game
player = Actor('player')
player.mapx = 0
player.mapy = 0

# each position in the tilemap is a 'Tile'
# with a type, an image and a timer
class Tile():
	def __init__(self, type):
		self.set(type)
	def set(self,type):
		self.timer = 0
		self.t=type
		self.i=images[type]

# populate the tilemap with some stuff
tilemap = [[Tile(WALL) if x%2==1 and y%2==1 else Tile(GROUND) for y in range(10)] for x in range(10)]
tilemap[3][2].set(BRICK)
tilemap[4][7].set(BRICK)

def on_key_down():

	# store new temporary player position
	newx = player.mapx
	newy = player.mapy

	# update new position using keyboard
	if keyboard.left and player.mapx > 0:
		newx -= 1
	elif keyboard.right and player.mapx < SIZE-1:
		newx += 1
	elif keyboard.up and player.mapy > 0:
		newy -= 1
	elif keyboard.down and player.mapy < SIZE-1:
		newy += 1

	# move player to new position if allowed
	if tilemap[newx][newy].t in [GROUND,EXPLOSION]:
		player.mapx = newx
		player.mapy = newy

	# space key to place bomb
	if keyboard.space:
		tilemap[player.mapx][player.mapy].set(BOMB)
		tilemap[player.mapx][player.mapy].timer = 150

def update():

	# iterate through each tile in tilemap
	for x in range(SIZE):
		for y in range(SIZE):

			tile = tilemap[x][y]

			# decrement timer
			if tile.timer > 0:
				tile.timer -= 1

			# process tile types on timer finish
			if tile.timer <= 0:

				# explosions eventually become ground
				if tile.t == EXPLOSION:
					tile.set(GROUND)

				# bombs eventually create explosions
				if tile.t == BOMB:
					# bombs radiate out in all 4 directions
					for angle in range(0,360,90):
						cosa = int(cos(radians(angle)))
						sina = int(sin(radians(angle)))
						# RANGE determines bomb reach
						for ran in range(1,RANGE):
							xoffset = ran*cosa
							yoffset = ran*sina
							# only create explosions within the tilemap, and only on ground and brick tiles
							if x+xoffset in range(0,SIZE) and y+yoffset in range(0,SIZE) and tilemap[x+xoffset][y+yoffset].t in [GROUND,BRICK]:
								tilemap[x+xoffset][y+yoffset].set(EXPLOSION)
								tilemap[x+xoffset][y+yoffset].timer = 50
							else:
								break

					# remove bomb
					tile.set(EXPLOSION)
					tile.timer = 50

def draw():
	# draw the tilemap
	for x in range(SIZE):
		for y in range(SIZE):
			screen.blit( tilemap[x][y].i,(x*45,y*45) )
	# draw the player
	screen.blit( player.image, (player.mapx*45,player.mapy*45) )