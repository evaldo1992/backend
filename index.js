	let express	=	require('express')
	let app 	= 	express()
	let bodyParser = require('body-parser')
	let sqlite3 = require('sqlite3').verbose()
	let db = new sqlite3.Database('institucion')
	
	
	function initDataBase()
	{
		db.run("DROP TABLE IF EXISTS cursos");
		db.run("CREATE TABLE IF NOT EXISTS cursos (id INTEGER PRIMARY KEY AUTOINCREMENT,codigo TEXT UNIQUE, nombre TEXT, des TEXT)");
		console.log("La tabla cursos ha sido correctamente creada");
		
		db.run("DROP TABLE IF EXISTS docentes");
		db.run("CREATE TABLE IF NOT EXISTS docentes (id INTEGER PRIMARY KEY AUTOINCREMENT,ide TEXT UNIQUE, nombre TEXT, apellido TEXT,genero TEXT)");
		console.log("La tabla docentes ha sido correctamente creada");
		
		db.run("DROP TABLE IF EXISTS estudiantes");
		db.run("CREATE TABLE IF NOT EXISTS estudiantes (id INTEGER PRIMARY KEY AUTOINCREMENT,ide TEXT UNIQUE, nombre TEXT, apellido TEXT,genero TEXT)");
		console.log("La tabla estudiantes ha sido correctamente creada");
		
		db.run("DROP TABLE IF EXISTS estudiantes_has_cursos");
		db.run("CREATE TABLE IF NOT EXISTS estudiantes_has_cursos (estudiante INTEGER,curso INTEGER)");
		console.log("La tabla estudiantes has cursos ha sido correctamente creada");
		
		db.run("DROP TABLE IF EXISTS docentes_has_cursos");
		db.run("CREATE TABLE IF NOT EXISTS docentes_has_cursos (docente INTEGER,curso INTEGER)");
		console.log("La tabla docentes has cursos ha sido correctamente creada");
	}
	
	
	
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(express.static('frontend'));
	
	  
	
	app.get('/',function(req,res){
	 res.sendFile('/index.html');
	});
	
	let router = express.Router();
	
	router.get('/',function(req,res){
		res.json({message:'Bienvenido a la API'})
	})
	
	
	/**
	 * @api {get} /curso/eliminar Eliminar
	 * @apiVersion 0.0.1
	 * @apiName eliminarCurso
	 * @apiGroup Curso
	 *
	 * @apiParam {Number} id número unico que se genera cuando se creo el curso.
	 *
	 * @apiSuccess {Text} status  success indica que todo ha ido bien, o fail que algo ha fallado.
	 * @apiSuccess {Text} message  indica el motivo del error o confirmacion de la inserción del curso.
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "status": success,
	 *       "message": Curso eliminado correctamente
	 *     }
	 *
	 */
	router.get('/curso/eliminar',function(req,res){
		let response={status:'success',message:'Curso eliminado correctamente'};
		let stmt=db.prepare("DELETE FROM cursos WHERE id=?")
		stmt.run(req.query.id,function(err){
			if(err){
				response.status='fail'
				response.message='No se pudo eliminar el curso'
				response.error=err
			}
			stmt.finalize();
			res.json(response)
		})
	})
	
	/**
	 * @api {get} /curso/listar Listar
	 * @apiVersion 0.0.1
	 * @apiName listarCurso
	 * @apiGroup Curso
	 *
	 *
	 * @apiSuccess {Text} status  success indica que todo ha ido bien, o fail que algo ha fallado.
	 * @apiSuccess {Text} message  mensaje de satisfacción o fallo.
	 * @apiSuccess {Array} cursos  arreglo con todos los cursos.
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "status": success,
	 *       "message": Curso encontrados
	 *     }
	 *
	 */
	router.get('/curso/listar',function(req,res){
	let response={status:'success',message:''};
	db.all('SELECT id,codigo,nombre,des FROM  cursos',function(err,cursos){
		if(err){
			response.status='fail'
			response.message='No se pudo listar los cursos'
			response.error=err
		}else{
			response.message='Cursos encontrados '+cursos.length
			response.cursos=cursos
		}
		res.json(response)
	})
	})
	
	/**
	 * @api {get} /curso/editar Editar
	 * @apiVersion 0.0.1
	 * @apiName editarCurso
	 * @apiGroup Curso
	 *
	 * @apiParam {Text} codigo Cada curso debe tener un codigo unico.
	 * @apiParam {Text} nombre Nombre del curso.
	 * @apiParam {Text} obs Observaciones que quieras agregar al curso.
	 * @apiParam {Number} id número unico que se genera cuando se creo el curso.
	 *
	 * @apiSuccess {Text} status  success indica que todo ha ido bien, o fail que algo ha fallado.
	 * @apiSuccess {Text} message  indica el motivo del error o confirmacion de la inserción del curso.
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "status": success,
	 *       "message": Curso editado correctamente
	 *     }
	 *
	 */
	router.get('/curso/editar',function(req,res){
		let response={status:'success',message:'Curso editado correctamente'};
		let stmt=db.prepare("UPDATE cursos SET codigo=?,nombre=?,des=? WHERE id=?")
		stmt.run(req.query.codigo,req.query.nombre,req.query.obs,req.query.id,function(err){
			if(err){
				response.status='fail'
				response.message='No se pudo editar el curso'
				response.error=err
			}
			stmt.finalize();
			res.json(response)
		})
	})
	
	/**
	 * @api {get} /curso/crear Insertar
	 * @apiVersion 0.0.1
	 * @apiName insertarCurso
	 * @apiGroup Curso
	 *
	 * @apiParam {Text} codigo Cada curso debe tener un codigo unico.
	 * @apiParam {Text} nombre Nombre del curso.
	 * @apiParam {Text} obs Observaciones que quieras agregar al curso.
	 *
	 * @apiSuccess {Text} status  success indica que todo ha ido bien, o fail que algo ha fallado.
	 * @apiSuccess {Text} message  indica el motivo del error o confirmacion de la inserción del curso.
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "status": success,
	 *       "message": Curso creado correctamente
	 *     }
	 *
	 */
	router.get('/curso/crear',function(req,res){
		let response={status:'success',message:'Curso creado correctamente'};
		let stmt = db.prepare("INSERT INTO cursos VALUES (?,?,?,?)")
		stmt.run(null,req.query.codigo,req.query.nombre,req.query.obs,function(err){
			if(err){
				response.status='fail'
				response.message='No se pudo crear el curso'
				response.error=err
			}
			stmt.finalize();
			res.json(response)
		})	
	})
	
	

	/**
	 * @api {get} /docente/obtener/:id Obtener
	 * @apiVersion 0.0.1
	 * @apiName obtenerDocente
	 * @apiGroup Docente
	 *
	 * @apiParam {Number} id número unico que se genera cuando se creo el docente.
	 *
	
	 *
	 * @apiSuccessExample Respuesta satisfactoria:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "status": "success",
	 *       "message": "Docente encontrado",
	 *       "docente":{id:1,ide:"1047447281",nombre:"Evaldo",apellido:"Vega Vivanco",genero:"M"},
	 *       "cursos":[{id:1,nombre:"MongoDB",des:"Curso corto de mongoDB"}]
	 *     }
	 *
	 * @apiSuccessExample Respuesta fallida:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "status": "fail",
	 *       "message": "No se pudo obtener el docente"
	 *     }
	 *
	 */
	router.get('/docente/obtener/:id',function(req,res){
		let response={status:'success',message:'Docente obtenido correctamente'}
		db.all('SELECT id,ide,nombre,apellido,genero FROM docentes WHERE id='+req.params.id+" LIMIT 1",function(err,docente){
			if(err){
				response.status='fail'
				response.message='No se pudo obtener el docente'
				response.error=err
				res.json(response)
			}else{
				if(docente.length>0){
					response.message='Docente encontrado'
					response.docente=docente[0]
					db.all('SELECT c.id,c.nombre,c.des FROM cursos c INNER JOIN docentes_has_cursos ehc ON ehc.docente='+docente[0].id+" WHERE c.id=ehc.curso",function(err,cursos){
						if(err){
							response.status='fail'
							response.message='No se pudo obtener los cursos del docente'
							response.error=err
						}else{
							response.cursos=cursos
						}
						res.json(response)
					})
				}else{
					response.message='Docente no encontrado'
					res.json(response)
				}
			}
		})
	})
	/**
	 * @api {get} /asignarCurso/docente/:d/curso/:c Asignar curso
	 * @apiVersion 0.0.1
	 * @apiName asignarCursoDocentes
	 * @apiGroup Docente
	 *
	 * @apiParam {Number} d número unico que se genera cuando se creo el docente.
	 * @apiParam {Number} c número unico que se genera cuando se creo el curso.
	 *
	
	 *
	 * @apiSuccessExample Respuesta satisfactoria:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "status": "success",
	 *       "message": "Curso asignado correctamente"
	 *     }
	 *
	 * @apiSuccessExample Respuesta fallida:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "status": "fail",
	 *       "message": "No se pudo el asignar el curso"
	 *     }
	 *
	 */
	router.get('/asignarCurso/docente/:e/curso/:c',function(req,res){
		let response={status:'success',message:'Curso asignado correctamente'}
		let stmt = db.prepare("INSERT INTO docentes_has_cursos VALUES (?,?)")
		stmt.run(req.params.e,req.params.c,function(err){
			if(err){
				response.status='fail'
				response.message='No se pudo obtener el asignar el curso'
				response.error=err
			}
			res.json(response)
		})
		
	})
	/**
	 * @api {get} /docente/crear Crear
	 * @apiVersion 0.0.1
	 * @apiName crearDocente
	 * @apiGroup Docente
	 *
	 * @apiParam {Text} ide Cada docente debe tener un número de identificación y debe ser unico.
	 * @apiParam {Text} nombre Nombre del docente.
	 * @apiParam {Text} apellido Apellidos del docente.
	 * @apiParam {Text} genero M para masculino y F para femenino.
	 *
	
	 *
	 * @apiExample {http} Ejemplo de uso:
	 *      http://localhost/api/docente/?ide=1047447281&nombre=Evaldo&apellido=Vega&genero=M
	 *
	 * @apiSuccessExample Respuesta satisfactoria:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "status": success,
	 *       "message": Docente creado correctamente
	 *     }
	 *
	  * @apiSuccessExample Respuesta fallida:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "status": fail,
	 *       "message": No se pudo crear el docente
	 *     }
	 *
	 */
	router.get('/docente/crear',function(req,res){
		let response={status:'success',message:'Docente creado correctamente'};
		let stmt = db.prepare("INSERT INTO docentes VALUES (?,?,?,?,?)")
		stmt.run(null,req.query.identificacion,req.query.nombre,req.query.apellido,req.query.genero,function(err){
			if(err){
				response.status='fail'
				response.message='No se pudo crear el docente'
				response.error=err
			}
			stmt.finalize();
			res.json(response)
		})	
	})
	/**
	 * @api {get} /docente/editar Editar
	 * @apiVersion 0.0.1
	 * @apiName editarDocente
	 * @apiGroup Docente
	 *
	 * @apiParam {Text} ide Cada docente debe tener un número de identificación y debe ser unico.
	 * @apiParam {Text} nombre Nombre del docente.
	 * @apiParam {Text} apellido Apellidos del docente.
	 * @apiParam {Text} genero M para masculino y F para femenino.
	 * @apiParam {Number} id número unico que se genera cuando se creo el docente.
	 *
	 *
	 * @apiSuccessExample Respuesta satisfactoria:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "status": success,
	 *       "message": Docente editado correctamente
	 *     }
	 *
	  * @apiSuccessExample Respuesta fallida:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "status": fail,
	 *       "message": No se pudo editar el docente
	 *   
	 *
	 */
	router.get('/docente/editar',function(req,res){
		let response={status:'success',message:'Docente editado correctamente'};
		let stmt=db.prepare("UPDATE docentes SET ide=?,nombre=?,apellido=?,genero=? WHERE id=?")
		stmt.run(req.query.ide,req.query.nombre,req.query.apellido,req.query.genero,req.query.id,function(err){
			if(err){
				response.status='fail'
				response.message='No se pudo editar el docente'
				response.error=err
			}
			stmt.finalize();
			res.json(response)
		})
	})
	/**
	 * @api {get} /docente/eliminar Eliminar
	 * @apiVersion 0.0.1
	 * @apiName eliminarDocente
	 * @apiGroup Docente
	 *
	 * @apiParam {Number} id número unico que se genera cuando se creo el docente.
	 *
	 * 
	 * @apiExample {http} Ejemplo de uso:
	 *      http://localhost/api/docente/eliminar/?id=1
	 *
	 * @apiSuccessExample Respuesta satisfactoria:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "status": success,
	 *       "message": Docente eliminado correctamente
	 *     }
	 *
	  * @apiSuccessExample Respuesta fallida:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "status": fail,
	 *       "message": No se pudo eliminar el docente
	 *  
	 */
	router.get('/docente/eliminar',function(req,res){
		let response={status:'success',message:'Docente eliminado correctamente'};
		let stmt=db.prepare("DELETE FROM docentes WHERE id=?")
		stmt.run(req.query.id,function(err){
			if(err){
				response.status='fail'
				response.message='No se pudo eliminar el docente'
				response.error=err
			}
			stmt.finalize();
			res.json(response)
		})
	})
	/**
	 * @api {get} /docente/listar Listar
	 * @apiVersion 0.0.1
	 * @apiName listarDocente
	 * @apiGroup Docente
	 *
	
	 *
	 * @apiSuccessExample Respuesta satisfactoria:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "status": "success",
	 *       "message": "Docentes encontrados 1",
	 *       "docentes":[{id:1,ide:"1047447281",nombre:"Evaldo",apellido:"Vega Vivanco",genero:"M"}]
	 *     }
	 *
	  *
	 * @apiSuccessExample Respuesta fallida:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "status": fail,
	 *       "message": No se pudo listar los docentes
	 *  
	 */
	router.get('/docente/listar',function(req,res){
		let response={status:'success',message:''};
		db.all('SELECT id,ide,nombre,apellido,genero FROM  docentes',function(err,docentes){
			if(err){
				response.status='fail'
				response.message='No se pudo listar los docentes'
				response.error=err
			}else{
				response.message='Docentes encontrados '+docentes.length
				response.docentes=docentes
			}
			res.json(response)
		})
	})
	
	/**
	 * @api {get} /estudiante/obtener/:id Obtener
	 * @apiVersion 0.0.1
	 * @apiName obtenerEstudiante
	 * @apiGroup Estudiante
	 *
	 * @apiParam {Number} id número unico que se genera cuando se creo el estudiante.
	 *
	
	 *
	 * @apiSuccessExample Respuesta satisfactoria:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "status": "success",
	 *       "message": "Estudiante encontrado",
	 *       "estudiante":{id:1,ide:"1047447281",nombre:"Evaldo",apellido:"Vega Vivanco",genero:"M"},
	 *       "cursos":[{id:1,nombre:"MongoDB",des:"Curso corto de mongoDB"}]
	 *     }
	 *
	 * @apiSuccessExample Respuesta fallida:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "status": "fail",
	 *       "message": "No se pudo obtener el estudiante"
	 *     }
	 *
	 */
	router.get('/estudiante/obtener/:id',function(req,res){
		let response={status:'success',message:'Estudiante obtenido correctamente'}
		db.all('SELECT id,ide,nombre,apellido,genero FROM estudiantes WHERE id='+req.params.id+" LIMIT 1",function(err,estudiante){
			if(err){
				response.status='fail'
				response.message='No se pudo obtener el estudiante'
				response.error=err
				res.json(response)
			}else{
				if(estudiante.length>0){
					response.message='Estudiante encontrado'
					response.estudiante=estudiante[0]
					db.all('SELECT c.id,c.nombre,c.des FROM cursos c INNER JOIN estudiantes_has_cursos ehc ON ehc.estudiante='+estudiante[0].id+" WHERE c.id=ehc.curso",function(err,cursos){
						if(err){
							response.status='fail'
							response.message='No se pudo obtener los cursos del estudiante'
							response.error=err
						}else{
							response.cursos=cursos
						}
						res.json(response)
					})
				}else{
					response.message='Estudiante no encontrado'
					res.json(response)
				}
			}
		})
	})
	/**
	 * @api {get} /asignarCurso/estudiante/:e/curso/:c Asignar curso
	 * @apiVersion 0.0.1
	 * @apiName asignarCursoEstudiante
	 * @apiGroup Estudiante
	 *
	 * @apiParam {Number} e número unico que se genera cuando se creo el estudiante.
	 * @apiParam {Number} c número unico que se genera cuando se creo el curso.
	 *
	
	 *
	 * @apiSuccessExample Respuesta satisfactoria:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "status": "success",
	 *       "message": "Curso asignado correctamente"
	 *     }
	 *
	 * @apiSuccessExample Respuesta fallida:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "status": "fail",
	 *       "message": "No se pudo el asignar el curso"
	 *     }
	 *
	 */
	router.get('/asignarCurso/estudiante/:e/curso/:c',function(req,res){
		let response={status:'success',message:'Curso asignado correctamente'}
		let stmt = db.prepare("INSERT INTO estudiantes_has_cursos VALUES (?,?)")
		stmt.run(req.params.e,req.params.c,function(err){
			if(err){
				response.status='fail'
				response.message='No se pudo el asignar el curso'
				response.error=err
			}
			res.json(response)
		})
		
	})
	/**
	 * @api {get} /estudiante/crear Crear
	 * @apiVersion 0.0.1
	 * @apiName crearEstudiante
	 * @apiGroup Estudiante
	 *
	 * @apiParam {Text} ide Cada estudiante debe tener un número de identificación y debe ser unico.
	 * @apiParam {Text} nombre Nombre del estudiante.
	 * @apiParam {Text} apellido Apellidos del estudiante.
	 * @apiParam {Text} genero M para masculino y F para femenino.
	 *
	 *
	 * @apiSuccessExample Respuesta satisfactoria:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "status": success,
	 *       "message": Estudiante creado correctamente
	 *     }
	 *
	  * @apiSuccessExample Respuesta fallida:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "status": fail,
	 *       "message": No se pudo crear el estudiante
	 *     }
	 *
	 */
	router.get('/estudiante/crear',function(req,res){
		let response={status:'success',message:'Estudiante creado correctamente'};
		let stmt = db.prepare("INSERT INTO estudiantes VALUES (?,?,?,?,?)")
		stmt.run(null,req.query.identificacion,req.query.nombre,req.query.apellido,req.query.genero,function(err){
			if(err){
				response.status='fail'
				response.message='No se pudo crear el estudiante'
				response.error=err
			}
			stmt.finalize();
			res.json(response)
		})	
	})
	/**
	 * @api {get} /estudiante/editar Editar
	 * @apiVersion 0.0.1
	 * @apiName editarEstudiante
	 * @apiGroup Estudiante
	 *
	 * @apiParam {Text} ide Cada estudiante debe tener un número de identificación y debe ser unico.
	 * @apiParam {Text} nombre Nombre del estudiante.
	 * @apiParam {Text} apellido Apellidos del estudiante.
	 * @apiParam {Text} genero M para masculino y F para femenino.
	 * @apiParam {Number} id número unico que se genera cuando se creo el estudiante.
	 *
	  * @apiSuccessExample Respuesta satisfactoria:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "status": success,
	 *       "message": Estudiante editado correctamente
	 *     }
	 *
	  * @apiSuccessExample Respuesta fallida:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "status": fail,
	 *       "message": No se pudo editar el estudiante
	 *     }
	 *
	 */
	router.get('/estudiante/editar',function(req,res){
		let response={status:'success',message:'Estudiante editado correctamente'};
		let stmt=db.prepare("UPDATE estudiantes SET ide=?,nombre=?,apellido=?,genero=? WHERE id=?")
		stmt.run(req.query.ide,req.query.nombre,req.query.apellido,req.query.genero,req.query.id,function(err){
			if(err){
				response.status='fail'
				response.message='No se pudo editar el estudiante'
				response.error=err
			}
			stmt.finalize();
			res.json(response)
		})
	})
	/**
	 * @api {get} /estudiante/eliminar Eliminar
	 * @apiVersion 0.0.1
	 * @apiName eliminarEstudiante
	 * @apiGroup Estudiante
	 *
	 * @apiParam {Number} id número unico que se genera cuando se creo el estudiante.
	 *
	 * 
	 * @apiExample {http} Ejemplo de uso:
	 *      http://localhost/api/estudiante/eliminar/?id=1
	 *
	 * @apiSuccessExample Respuesta satisfactoria:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "status": success,
	 *       "message": Estudiante eliminado correctamente
	 *     }
	 *
	  * @apiSuccessExample Respuesta fallida:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "status": fail,
	 *       "message": No se pudo eliminar el estudiante
	 *  
	 */
	router.get('/estudiante/eliminar',function(req,res){
		let response={status:'success',message:'Estudiante eliminado correctamente'};
		let stmt=db.prepare("DELETE FROM estudiantes WHERE id=?")
		stmt.run(req.query.id,function(err){
			if(err){
				response.status='fail'
				response.message='No se pudo eliminar el estudiante'
				response.error=err
			}
			stmt.finalize();
			res.json(response)
		})
	})
	/**
	 * @api {get} /estudiante/listar Listar
	 * @apiVersion 0.0.1
	 * @apiName listarEstudiante
	 * @apiGroup Estudiante
	 *
	
	 *
	 * @apiSuccessExample Respuesta satisfactoria:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "status": "success",
	 *       "message": "Estudiantes encontrados 1",
	 *       "estudiantes":[{id:1,ide:"1047447281",nombre:"Evaldo",apellido:"Vega Vivanco",genero:"M"}]
	 *     }
	 *
	  *
	 * @apiSuccessExample Respuesta fallida:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "status": fail,
	 *       "message": No se pudo listar los docentes
	 *  
	 */
	router.get('/estudiante/listar',function(req,res){
		let response={status:'success',message:''};
		db.all('SELECT id,ide,nombre,apellido,genero FROM  estudiantes',function(err,docentes){
			if(err){
				response.status='fail'
				response.message='No se pudo listar los estudiantes'
				response.error=err
			}else{
				response.message='Estudiantes encontrados '+docentes.length
				response.docentes=docentes
			}
			res.json(response)
		})
	})
	
	/**
	 * @api {get} /init init
	 * @apiVersion 0.0.1
	 * @apiName init
	 * @apiGroup Inicializar
	 *
	 * @apiDescription
	 *Crea todas las tablas necesarias para empezar a trabajar
	 * @apiSuccessExample Respuesta:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "message": "API inicializada"
	 *     }
	 *
	 */
	router.get('/init',function(req,res){
		initDataBase()
		res.json({message:'API inicializada'})
	})
	
	app.use('/api', router);
	
	app.listen(3200, function () {
	  console.log('Example app listening on port 3200!');
	});