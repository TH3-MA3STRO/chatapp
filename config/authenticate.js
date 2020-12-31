module.exports = {
    ensureAuthenticated: (req,res,next)=>{
        if(req.isAuthenticated()){
            return next()
        }
        req.flash('error', 'Please login first')
        res.redirect('/login')
    },
    forwardAuthenticated: (req,res,next)=>{
        if(!req.isAuthenticated()){
            return next()
        }
        res.redirect('/home')
    },
    thrower: (err)=>{
        throw err
    }
}