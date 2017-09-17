/**
 * Created by yujian on 2017/08/14.
 */

define(['src/components/baseTable/indexModel'], function (Model) {
    var Collection = Backbone.Collection.extend({
        model: Model,
        url: './api/register/officeArea',
        parse : function(res) {
            if(res.success){
               return res.list;
            }
        }
    });

    return Collection;
});