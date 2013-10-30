/**
 * @fileOverview Html5Runtime
 * @import base.js, runtime/runtime.js, runtime/compbase.js
 */
define( 'webuploader/runtime/html5/runtime', [
        'webuploader/base',
        'webuploader/runtime/runtime',
        'webuploader/runtime/compbase'
    ], function( Base, Runtime, CompBase ) {

        var $ = Base.$,
            type = 'html5',
            pool = {},
            components = {};

        function Html5Runtime() {
            var pool = {},
                destory = this.destory;

            Runtime.apply( this, arguments );
            this.type = type;


            // 这个方法的调用者，实际上是RuntimeClient
            this.exec = function( comp, fn/*, args...*/) {
                var client = this,
                    uid = client.uid,
                    args = Base.slice( arguments, 2 ),
                    instance;

                if ( components[ comp ] ) {
                    instance = pool[ uid ] = pool[ uid ] || new components[ comp ]( client.getRuntime() );

                    if ( instance[ fn ] ) {
                        instance.owner = client;
                        instance.options = client.options;
                        return instance[ fn ].apply( instance, args );
                    }
                }
            }

            this.destory = function() {
                // @todo 删除池子中的所有实例
                return destory && destory.apply( this, arguments );
            };
        }

        Base.inherits( Runtime, {
            constructor: Html5Runtime,

            // 不需要连接其他程序，直接执行callback
            init: function( cb ) {
                var me = this;
                setTimeout( function() {
                    me.trigger('ready');
                }, 1 );
            }

        } );

        Html5Runtime.register = function( name, component ) {
            return components[ name ] = Base.inherits( CompBase, component );
        };

        // 注册html5运行时。
        if ( window.Blob && window.FileReader && window.DataView ) {
            Runtime.addRuntime( type, Html5Runtime );
        }

        return Html5Runtime;
    } );