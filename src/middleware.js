export function onRequest(context, next) {
    context.locals.lang = context.currentLocale ?? "de";
    
    return next();
}