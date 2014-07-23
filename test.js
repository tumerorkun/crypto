/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
//  Crypto Test Harness                                                    (c) Chris Veness 2014  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
'use strict'

var test = require('tape');

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* AES - test vectors: csrc.nist.gov/publications/fips/fips197/fips-197.pdf C.1                   */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

test('aes', function(assert) {
    var Aes = require('./aes.js');

    var plaintext = vectorToBytes('00 11 22 33 44 55 66 77 88 99 aa bb cc dd ee ff');

    var key128    = vectorToBytes('00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f');
    var cipher128 = vectorToBytes('69 c4 e0 d8 6a 7b 04 30 d8 cd b7 80 70 b4 c5 5a');

    var key192    = vectorToBytes('00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f 10 11 12 13 14 15 16 17');
    var cipher192 = vectorToBytes('dd a9 7c a4 86 4c df e0 6e af 70 a0 ec 0d 71 91');

    var key256    = vectorToBytes('00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f 10 11 12 13 14 15 16 17 18 19 1a 1b 1c 1d 1e 1f');
    var cipher256 = vectorToBytes('8e a2 b7 ca 51 67 45 bf ea fc 49 90 4b 49 60 89');

    assert.deepEqual(Aes.cipher(plaintext, Aes.keyExpansion(key128)), cipher128, 'Aes-128-bit test vector');
    assert.deepEqual(Aes.cipher(plaintext, Aes.keyExpansion(key192)), cipher192, 'Aes-192-bit test vector');
    assert.deepEqual(Aes.cipher(plaintext, Aes.keyExpansion(key256)), cipher256, 'Aes-256-bit test vector');
    assert.end();

    function vectorToBytes(v) {
        var a = v.split(/ /);
        for (var i=0; i<a.length; i++) a[i] = parseInt('0x'+a[i]);
        return a;
    }

    function bytesToVector(b) {
        var v = b.slice(); // clone b
        for (var i=0; i<v.length; i++) {
            v[i] = v[i]<0x10 ? '0'+v[i].toString(16) : v[i].toString(16);
        }
        return v.join(' ');
    }
});

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Aes CTR: test Unicode text & password (ciphertext will be different on each invocation)        */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

test('aes.ctr', function(assert) {
    var Aes = require('./aes.js');
    Aes.Ctr = require('./aes-ctr.js');

    var origtext = 'My big secret סוד קצת بت سرية  ความลับบิต 位的秘密';
    var ciphertext = Aes.Ctr.encrypt(origtext, 'pāšşŵōřđ', 256);
    var decrtext = Aes.Ctr.decrypt(ciphertext, 'pāšşŵōřđ', 256);

    assert.equal(decrtext, origtext, 'decrypted ciphertext matches original text');
    assert.end();
});

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Block TEA: test decrypted encrypted text matches original text (with Unicode text & password)  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

test('tea-block', function(assert) {
    var Tea = require('./tea-block.js');

    var origtext = 'My big secret סוד קצת بت سرية  ความลับบิต 位的秘密';
    var ciphertext = Tea.encrypt(origtext, 'pāšşŵōřđ');
    var decrtext = Tea.decrypt(ciphertext, 'pāšşŵōřđ');

    assert.equal(decrtext, origtext, 'decrypted ciphertext matches original text');
    assert.end();
});

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
