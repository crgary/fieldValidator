# field-validator
A Validator Field Without Form

Requirements
------------

* `jQuery`_ 1.7.1+

.. _jQuery: https://jquery.com/

Usage
-----

Call the fieldValidator via javascript::

    $('.field-validator').fieldValidator({});


Configuration
^^^^^^^^^^^^^

:doc:`options` are passed to the ``fieldValidator`` function via an options hash at instantiation::

    $('.field-validator').fieldValidator({
        group_validator: ".field-validation",
        on_click: function(){
        
        }
    });

Most options may be provided as data-attributes on the target element:
+Example 1
.. code-block:: html

    <input type="text" class="field-validator" data-message-error="This field is required" requried>

::

    $('.field-validator').fieldValidator({});
    
+Example 2
.. code-block:: html

    <div>
      <label for="txt" >Text field</label>
      <input type="text" id="txt" class="field-validator" data-message-error="This field is required" requried>
    </div>
    <div>
      <label for="txt-email" >Email field</label>
      <input type="email" id="txt-email" class="field-validator" data-message-error="This email is not valid" requried>
    </div>
    <div>
      <label for="txt-pwd" >Password field</label>
      <input type="password" id="txt-pwd" class="field-validator" data-message-error="This field is required" requried>
    </div>
    <div>
      <label for="ddl" >Password field</label>
      <select type="text" id="ddl" class="field-validator" data-message-error="This field is required" requried>
    </div>
    <div>
      <a href="#" class="btn-validator" >Button example 1</a>
      <button class="btn-validator">Button example 2</button>
      <input type="submit" class="btn-validator" value="Button example 3"/>
    </div>

::

    $('.btn-validator').fieldValidator({
        group_validator: ".field-validation",
        on_click: function(){
        
        }
    });
